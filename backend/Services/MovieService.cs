using backend.Models;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace backend.Services
{
    public class MovieService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "f87a9b269057db925af18a30c6991197";
        private readonly string _baseUrl = "https://api.themoviedb.org/3";

        public MovieService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<IEnumerable<Movie>> GetAllMoviesAsync()
        {
            var maxPages = 10; 
            var allMovies = new List<Movie>();


            for (int page = 1; page <= maxPages; page++)
            {
                var response = await _httpClient.GetAsync($"{_baseUrl}/movie/popular?api_key={_apiKey}&page={page}");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var json = JObject.Parse(content);

                foreach (var result in json["results"])
                {
                    allMovies.Add(new Movie
                    {
                        Id = (int)result["id"],
                        Title = (string)result["title"],
                        Rating = (double)result["vote_average"],
                        PosterUrl = $"https://image.tmdb.org/t/p/w500{result["poster_path"]}",
                        Overview = (string)result["overview"],
                        ReleaseDate = (string)result["release_date"]
                    });
                }
            }

            return allMovies;
        }
        public async Task<IEnumerable<Movie>> GetPopularMoviesAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/movie/popular?api_key={_apiKey}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JObject.Parse(content);

            var movies = new List<Movie>();

            foreach (var result in json["results"])
            {
                movies.Add(new Movie
                {
                    Id = (int)result["id"],
                    Title = (string)result["title"],
                    Rating = (double)result["vote_average"],
                    PosterUrl = $"https://image.tmdb.org/t/p/w500{result["poster_path"]}",
                    Overview = (string)result["overview"],
                    ReleaseDate = (string)result["release_date"]
                });
            }

            return movies;
        }
        public async Task<IEnumerable<Movie>> SearchMoviesByTitleAsync(string title)
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/search/movie?query={title}&api_key={_apiKey}");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var json = JObject.Parse(content);

            var movies = new List<Movie>();

            foreach (var result in json["results"])
            {
                movies.Add(new Movie
                {
                    Id = (int)result["id"],
                    Title = (string)result["title"],
                    Rating = (double)result["vote_average"],
                    PosterUrl = $"https://image.tmdb.org/t/p/w500{result["poster_path"]}",
                    Overview = (string)result["overview"],
                    ReleaseDate = (string)result["release_date"]

                });
            }

            return movies;
        }
    }
}
