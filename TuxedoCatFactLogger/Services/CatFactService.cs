using TuxedoCatFactLogger.Clients;
using TuxedoCatFactLogger.Models;

namespace TuxedoCatFactLogger.Services;

/// <summary>
/// Implementation of ICatFactService demonstrating:
/// - Constructor Dependency Injection
/// - Async/await file streaming & appending
/// - Formatting lines as: YYYY-MM-DD | <Fact text> | <length>
/// - In-memory and file-based statistical aggregation
/// </summary>
public class CatFactService : ICatFactService
{
    private readonly ICatFactClient _catFactClient;
    private readonly string _storagePath;
    private int _requestsMadeCount = 0;
    private string? _latestFactText = null;

    public CatFactService(ICatFactClient catFactClient)
    {
        _catFactClient = catFactClient ?? throw new ArgumentNullException(nameof(catFactClient));

        // Ensure Data folder exists
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

        // 1. Fetch fact from REST API (catfact.ninja/fact)
        var apiFact = await _catFactClient.GetRandomFactAsync(cancellationToken);
        _latestFactText = apiFact.Fact;

        // 2. Prepare structured entry: YYYY-MM-DD | <Fact text> | <length>
        var entry = new StoredFactEntry(
            DateOnly.FromDateTime(DateTime.UtcNow),
            apiFact.Fact,
            apiFact.Length
        );

        // 3. Append to file on a new line (\n)
        await File.AppendAllLinesAsync(
            _storagePath,
            new[] { entry.ToFileLine() },
            cancellationToken
        );

        return entry;
    }

    public async Task<string[]> ReadAllStoredLinesAsync(CancellationToken cancellationToken = default)
    {
        if (!File.Exists(_storagePath))
        {
            return Array.Empty<string>();
        }

        return await File.ReadAllLinesAsync(_storagePath, cancellationToken);
    }

    public async Task<CollectorStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default)
    {
        var lines = await ReadAllStoredLinesAsync(cancellationToken);
        var validLines = lines.Where(l => !string.IsNullOrWhiteSpace(l)).ToList();

        if (validLines.Count == 0)
        {
            return new CollectorStatistics(
                RequestsMade: _requestsMadeCount,
                FactsSaved: 0,
                AverageFactLength: 0,
                LatestFact: _latestFactText
            );
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

        // If no latestFact in memory, take the fact from the last line
        if (_latestFactText == null && validLines.Count > 0)
        {
            var lastParsed = StoredFactEntry.TryParse(validLines[^1]);
            lastFact = lastParsed?.FactText ?? validLines[^1];
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
}
