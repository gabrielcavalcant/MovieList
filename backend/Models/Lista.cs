using System.Collections.Generic;

namespace backend.Models
{
    public class Lista
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Relação N -> N com Favorite
        public ICollection<Favorite> FavoriteMovies { get; set; } = new List<Favorite>();
    }
}