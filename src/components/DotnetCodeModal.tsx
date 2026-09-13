import React, { useState } from 'react';
import { X, Terminal, Copy, Check, FileCode, CheckCircle, Folder, FileText } from 'lucide-react';

interface DotnetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DotnetCodeModal: React.FC<DotnetCodeModalProps> = ({ isOpen, onClose }) => {
  const [activeFile, setActiveFile] = useState<'Program' | 'Models' | 'Clients' | 'Services' | 'Csproj' | 'Txt'>('Program');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const files = {
    Program: {
      name: 'Program.cs',
      path: 'TuxedoCatFactLogger/Program.cs',
      code: `using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TuxedoCatFactLogger.Clients;
using TuxedoCatFactLogger.Services;

namespace TuxedoCatFactLogger;

public class Program
{
    public static async Task Main(string[] args)
    {
        // 1. Configure Microsoft Dependency Injection Container
        var services = new ServiceCollection();

        // Register HttpClient & ICatFactClient with Microsoft IHttpClientFactory
        services.AddHttpClient<ICatFactClient, CatFactClient>();

        // Register core service with Constructor Dependency Injection
        services.AddScoped<ICatFactService, CatFactService>();

        var serviceProvider = services.BuildServiceProvider();

        // 2. Resolve ICatFactService from IoC Container
        var catFactService = serviceProvider.GetRequiredService<ICatFactService>();

        // 3. Determine how many facts to fetch (default: 1, or pass e.g. --count=3)
        int count = 1;
        var countArg = args.FirstOrDefault(a => a.StartsWith("--count="));
        if (countArg != null && int.TryParse(countArg.Split('=')[1], out var parsedCount))
        {
            count = Math.Clamp(parsedCount, 1, 20);
        }

        Console.WriteLine("=".Repeat(40));
        Console.WriteLine("=== Tuxedo Cat Fact Logger ===");
        Console.WriteLine("  (Microsoft .NET 8 • C# • DI)");
        Console.WriteLine("=".Repeat(40));
        Console.WriteLine($"[Storage] Plik: {catFactService.GetStorageFilePath()}");
        Console.WriteLine($"[Request] Pobieranie {count} faktu/faktów z catfact.ninja/fact...\\n");

        for (int i = 0; i < count; i++)
        {
            try
            {
                var entry = await catFactService.FetchAndSaveFactAsync();
                Console.WriteLine($"[{i + 1}/{count}] [+] Dodano wiersz: {entry.ToFileLine()}");
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"[!] Błąd pobierania ({i + 1}): {ex.Message}");
                Console.ResetColor();
            }
        }

        // 4. Retrieve and display statistics as specified in Task 3
        var stats = await catFactService.GetStatisticsAsync();
        var allLines = await catFactService.ReadAllStoredLinesAsync();

        Console.WriteLine();
        Console.WriteLine("=== Cat Fact Collector ===");
        Console.WriteLine();
        Console.WriteLine($"Requests made: {stats.RequestsMade}");
        Console.WriteLine($"Facts saved: {stats.FactsSaved}");
        Console.WriteLine($"Average fact length: {stats.AverageFactLength} characters");
        Console.WriteLine();
        Console.WriteLine("Latest fact:");
        Console.WriteLine(stats.LatestFact ?? "(brak)");
        Console.WriteLine();

        Console.WriteLine("Plik:");
        Console.WriteLine();
        foreach (var line in allLines.TakeLast(5))
        {
            Console.WriteLine(line);
        }
        Console.WriteLine();
    }
}

internal static class StringExtensions
{
    public static string Repeat(this string str, int count) =>
        string.Concat(Enumerable.Repeat(str, count));
}`,
    },
    Models: {
      name: 'Models/CatFact.cs',
      path: 'TuxedoCatFactLogger/Models/CatFact.cs',
      code: `using System.Text.Json.Serialization;

namespace TuxedoCatFactLogger.Models;

/// <summary>
/// DTO representing the response from the REST API: https://catfact.ninja/fact
/// Deserialized with System.Text.Json
/// </summary>
public record CatFact(
    [property: JsonPropertyName("fact")] string Fact,
    [property: JsonPropertyName("length")] int Length
);

/// <summary>
/// Formatted entry written to the local file:
/// 2026-09-10 | Cats sleep for around 12-16 hours a day. | 42
/// </summary>
public record StoredFactEntry(
    DateOnly Date,
    string FactText,
    int Length
)
{
    public string ToFileLine() => $"{Date:yyyy-MM-dd} | {FactText} | {Length}";

    public static StoredFactEntry? TryParse(string line)
    {
        if (string.IsNullOrWhiteSpace(line)) return null;

        var parts = line.Split('|');
        if (parts.Length >= 3 &&
            DateOnly.TryParse(parts[0].Trim(), out var date) &&
            int.TryParse(parts[2].Trim(), out var length))
        {
            var fact = parts[1].Trim();
            return new StoredFactEntry(date, fact, length);
        }

        return new StoredFactEntry(DateOnly.FromDateTime(DateTime.UtcNow), line.Trim(), line.Trim().Length);
    }
}

public record CollectorStatistics(
    int RequestsMade,
    int FactsSaved,
    int AverageFactLength,
    string? LatestFact
);`,
    },
    Clients: {
      name: 'Clients/CatFactClient.cs',
      path: 'TuxedoCatFactLogger/Clients/CatFactClient.cs',
      code: `using System.Net.Http.Json;
using TuxedoCatFactLogger.Models;

namespace TuxedoCatFactLogger.Clients;

public interface ICatFactClient
{
    Task<CatFact> GetRandomFactAsync(CancellationToken cancellationToken = default);
}

public class CatFactClient : ICatFactClient
{
    private readonly HttpClient _httpClient;
    private const string ApiEndpoint = "https://catfact.ninja/";

    public CatFactClient(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        
        if (_httpClient.BaseAddress == null)
        {
            _httpClient.BaseAddress = new Uri(ApiEndpoint);
        }
        
        _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("Accept", "application/json");
        _httpClient.DefaultRequestHeaders.TryAddWithoutValidation("User-Agent", "TuxedoCatFactLogger/1.0 (Microsoft .NET)");
    }

    public async Task<CatFact> GetRandomFactAsync(CancellationToken cancellationToken = default)
    {
        var result = await _httpClient.GetFromJsonAsync<CatFact>("fact", cancellationToken);
        return result ?? throw new InvalidOperationException("API zwróciło pustą odpowiedź.");
    }
}`,
    },
    Services: {
      name: 'Services/CatFactService.cs',
      path: 'TuxedoCatFactLogger/Services/CatFactService.cs',
      code: `using TuxedoCatFactLogger.Clients;
using TuxedoCatFactLogger.Models;

namespace TuxedoCatFactLogger.Services;

public interface ICatFactService
{
    Task<StoredFactEntry> FetchAndSaveFactAsync(CancellationToken cancellationToken = default);
    Task<CollectorStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default);
    Task<string[]> ReadAllStoredLinesAsync(CancellationToken cancellationToken = default);
    string GetStorageFilePath();
}

public class CatFactService : ICatFactService
{
    private readonly ICatFactClient _catFactClient;
    private readonly string _storagePath;
    private int _requestsMadeCount = 0;
    private string? _latestFactText = null;

    // Constructor Dependency Injection
    public CatFactService(ICatFactClient catFactClient)
    {
        _catFactClient = catFactClient ?? throw new ArgumentNullException(nameof(catFactClient));

        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var dataDir = Path.Combine(baseDir, "Data");
        if (!Directory.Exists(dataDir))
        {
            Directory.CreateDirectory(dataDir);
        }

        _storagePath = Path.Combine(dataDir, "cat-facts.txt");
    }

    public string GetStorageFilePath() => _storagePath;

    public async Task<StoredFactEntry> FetchAndSaveFactAsync(CancellationToken cancellationToken = default)
    {
        _requestsMadeCount++;

        var apiFact = await _catFactClient.GetRandomFactAsync(cancellationToken);
        _latestFactText = apiFact.Fact;

        var entry = new StoredFactEntry(
            DateOnly.FromDateTime(DateTime.UtcNow),
            apiFact.Fact,
            apiFact.Length
        );

        // Append line to file
        await File.AppendAllLinesAsync(
            _storagePath,
            new[] { entry.ToFileLine() },
            cancellationToken
        );

        return entry;
    }

    public async Task<string[]> ReadAllStoredLinesAsync(CancellationToken cancellationToken = default)
    {
        if (!File.Exists(_storagePath)) return Array.Empty<string>();
        return await File.ReadAllLinesAsync(_storagePath, cancellationToken);
    }

    public async Task<CollectorStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var lines = await ReadAllStoredLinesAsync(cancellationToken);
        var validLines = lines.Where(l => !string.IsNullOrWhiteSpace(l)).ToList();

        if (validLines.Count == 0)
        {
            return new CollectorStatistics(_requestsMadeCount, 0, 0, _latestFactText);
        }

        int totalLength = 0;
        string? lastFact = _latestFactText;

        foreach (var line in validLines)
        {
            var parsed = StoredFactEntry.TryParse(line);
            if (parsed != null)
            {
                totalLength += parsed.Length;
                lastFact ??= parsed.FactText;
            }
            else
            {
                totalLength += line.Length;
            }
        }

        int averageLength = (int)Math.Round((double)totalLength / validLines.Count);
        int totalRequests = Math.Max(_requestsMadeCount, validLines.Count);

        return new CollectorStatistics(
            RequestsMade: totalRequests,
            FactsSaved: validLines.Count,
            AverageFactLength: averageLength,
            LatestFact: lastFact
        );
    }
}`,
    },
    Csproj: {
      name: 'TuxedoCatFactLogger.csproj',
      path: 'TuxedoCatFactLogger/TuxedoCatFactLogger.csproj',
      code: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
    <RootNamespace>TuxedoCatFactLogger</RootNamespace>
    <AssemblyName>TuxedoCatFactLogger</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <!-- Microsoft Technology Stack for Dependency Injection & HTTP -->
    <PackageReference Include="Microsoft.Extensions.DependencyInjection" Version="8.0.0" />
    <PackageReference Include="Microsoft.Extensions.Http" Version="8.0.0" />
    <PackageReference Include="Microsoft.Extensions.Hosting" Version="8.0.0" />
  </ItemGroup>

</Project>`,
    },
    Txt: {
      name: 'Data/cat-facts.txt',
      path: 'TuxedoCatFactLogger/Data/cat-facts.txt',
      code: `2026-09-10 | Cats sleep for around 12-16 hours a day. | 42
2026-09-10 | Cats have five toes on their front paws. | 41`,
    },
  };

  const currentFile = files[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-zinc-950 flex items-center justify-center font-black">
              C#
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>TuxedoCatFactLogger (.NET 8)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Microsoft Stack
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Wzorcowa struktura repozytorium C# z DI, HttpClient i zapisem statystyk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File selector tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 border-b border-zinc-800 overflow-x-auto text-xs font-mono">
          <span className="text-zinc-500 mr-2 flex items-center gap-1 text-[11px]">
            <Folder className="w-3.5 h-3.5" /> Pliki:
          </span>
          {(Object.keys(files) as Array<keyof typeof files>).map((key) => {
            const f = files[key];
            const isActive = activeFile === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveFile(key)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active file path and copy button */}
        <div className="flex items-center justify-between px-5 py-2 bg-zinc-900/50 border-b border-zinc-800/60 text-xs font-mono">
          <span className="text-emerald-400 text-[11px] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            {currentFile.path}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-sans cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Skopiowano</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Kopiuj plik</span>
              </>
            )}
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 p-5 overflow-y-auto bg-zinc-950 font-mono text-xs text-zinc-200">
          <pre className="leading-relaxed whitespace-pre">{currentFile.code}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Katalog z tym projektem znajduje się w <code className="text-white">/TuxedoCatFactLogger</code> w repozytorium.</span>
          </div>
          <div className="font-mono text-white text-[11px]">
            Uruchomienie: <span className="text-emerald-400">dotnet run</span>
          </div>
        </div>
      </div>
    </div>
  );
};
