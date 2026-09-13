using TuxedoCatFactLogger.Models;

namespace TuxedoCatFactLogger.Services;

/// <summary>
/// Business logic service coordinating API calls, local file persistence,
/// and calculating statistics.
/// </summary>
public interface ICatFactService
{
    Task<StoredFactEntry> FetchAndSaveFactAsync(CancellationToken cancellationToken = default);
    Task<CollectorStatistics> GetStatisticsAsync(CancellationToken cancellationToken = default);
    Task<string[]> ReadAllStoredLinesAsync(CancellationToken cancellationToken = default);
    string GetStorageFilePath();
}
