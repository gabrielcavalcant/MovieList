using System.Collections.Generic;

namespace backend.Models
{
    public class List
    {
        public int Id { get; set; }
        public string Name { get; set; }

        // Relação N -> N com Favorite
        public ICollection<Favorite> Favorites { get; set; }
    }
}
