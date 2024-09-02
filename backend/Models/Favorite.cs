namespace backend.Models
{
    public class Favorite
    {
        public int Id { get; set; }
        public int MovieId { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public string PosterUrl { get; set; }
        public string Overview { get; set; }
        public string ReleaseDate { get; set; }
    }
}
