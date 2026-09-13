using Microsoft.Extensions.DependencyInjection;
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
        Console.WriteLine($"[Request] Pobieranie {count} faktu/faktów z catfact.ninja/fact...\n");

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
}
