using System.Net.Http.Json;
using TuxedoCatFactLogger.Models;

namespace TuxedoCatFactLogger.Clients;

/// <summary>
/// Microsoft HttpClient implementation using System.Text.Json
/// Configured for dependency injection via IHttpClientFactory.
/// </summary>
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
}
