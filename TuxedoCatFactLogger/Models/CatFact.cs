using System.Text.Json.Serialization;

namespace TuxedoCatFactLogger.Models;

/// <summary>
/// DTO representing the response from the REST API: https://catfact.ninja/fact
/// Serialized/Deserialized using System.Text.Json
/// </summary>
public record CatFact(
    [property: JsonPropertyName("fact")] string Fact,
    [property: JsonPropertyName("length")] int Length
);

/// <summary>
/// Represents a formatted entry written to the local file:
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

        // Fallback for non-formatted raw lines
        return new StoredFactEntry(DateOnly.FromDateTime(DateTime.UtcNow), line.Trim(), line.Trim().Length);
    }
}

/// <summary>
/// Summary statistics for Cat Fact Collector
/// </summary>
public record CollectorStatistics(
    int RequestsMade,
    int FactsSaved,
    int AverageFactLength,
    string? LatestFact
);
