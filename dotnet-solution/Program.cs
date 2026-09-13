using System.Text.Json.Serialization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CatFactApp;

// 1. Model danych
public record CatFactResponse(
    [property: JsonPropertyName("fact")] string Fact,
    [property: JsonPropertyName("length")] int Length
);

// 2. Interfejs klienta HTTP
public interface ICatFactClient
{
    Task<CatFactResponse> GetRandomFactAsync(CancellationToken cancellationToken = default);
}

// 3. Implementacja klienta HTTP z IHttpClientFactory
public class CatFactClient : ICatFactClient
{
    private readonly HttpClient _httpClient;

    public CatFactClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://catfact.ninja/");
        _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "CatFactConsoleApp/1.0");
    }

    public async Task<CatFactResponse> GetRandomFactAsync(CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetFromJsonAsync<CatFactResponse>("fact", cancellationToken);
        return response ?? throw new InvalidOperationException("Otrzymano pusta odpowiedz z API");
    }
}

// 4. Interfejs serwisu plików
public interface IFileStorageService
{
    Task EnsureFileExistsAsync();
    Task AppendLineAsync(string line);
    Task<string[]> ReadAllLinesAsync();
    string GetFilePath();
}

// 5. Implementacja serwisu plików
public class FileStorageService : IFileStorageService
{
    private readonly string _filePath;

    public FileStorageService(string fileName = "cat_facts.txt")
    {
        _filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, fileName);
    }

    public string GetFilePath() => _filePath;

    public async Task EnsureFileExistsAsync()
    {
        if (!File.Exists(_filePath))
        {
            await File.WriteAllTextAsync(_filePath, string.Empty);
        }
    }

    public async Task AppendLineAsync(string line)
    {
        await EnsureFileExistsAsync();
        // Wymóg zadania: dopisywanie nowego wiersza otrzymanych danych w nowej linijce
        await File.AppendAllLinesAsync(_filePath, new[] { line });
    }

    public async Task<string[]> ReadAllLinesAsync()
    {
        if (!File.Exists(_filePath)) return Array.Empty<string>();
        return await File.ReadAllLinesAsync(_filePath);
    }
}

// 6. Główny serwis aplikacji z Dependency Injection (Constructor Injection)
public interface ICatFactService
{
    Task RunAsync();
}

public class CatFactService : ICatFactService
{
    private readonly ICatFactClient _catFactClient;
    private readonly IFileStorageService _fileStorage;

    // Wstrzykiwanie zależności przez konstruktor (Dependency Injection)
    public CatFactService(ICatFactClient catFactClient, IFileStorageService fileStorage)
    {
        _catFactClient = catFactClient;
        _fileStorage = fileStorage;
    }

    public async Task RunAsync()
    {
        Console.WriteLine("Pobieranie faktu z endpointu https://catfact.ninja/fact...");
        var factData = await _catFactClient.GetRandomFactAsync();

        Console.WriteLine($"Otrzymano fakt (dlugosc {factData.Length}): {factData.Fact}");

        // Zapis do pliku tekstowego w nowej linijce
        await _fileStorage.AppendLineAsync(factData.Fact);

        Console.WriteLine($"Pomyslnie dopisano nowy wiersz do pliku: {_fileStorage.GetFilePath()}");
        var allLines = await _fileStorage.ReadAllLinesAsync();
        Console.WriteLine($"Aktualna liczba wierszy w pliku: {allLines.Length}");
    }
}

// 7. Punkt wejściowy z konfiguracją DI (Microsoft.Extensions.DependencyInjection)
public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = Host.CreateApplicationBuilder(args);

        // Rejestracja serwisów w kontenerze IoC (Dependency Injection)
        builder.Services.AddHttpClient<ICatFactClient, CatFactClient>();
        builder.Services.AddSingleton<IFileStorageService, FileStorageService>();
        builder.Services.AddTransient<ICatFactService, CatFactService>();

        using var host = builder.Build();

        // Rozwiązanie zależności z kontenera
        var service = host.Services.GetRequiredService<ICatFactService>();
        await service.RunAsync();
    }
}
