using TuxedoCatFactLogger.Models;

namespace TuxedoCatFactLogger.Clients;

/// <summary>
/// Abstraction for communicating with the external Cat Fact REST API.
/// Enables loose coupling and easy unit testing via Dependency Injection.
/// </summary>
public interface ICatFactClient
{
    Task<CatFact> GetRandomFactAsync(CancellationToken cancellationToken = default);
}
