using backend.Models;

namespace backend.Models
{
    public class FavoriteList
    {
        public int ListId { get; set; }
        public Lista Lista { get; set; }

        public int FavoriteId { get; set; }
        public Favorite Favorite { get; set; }
    }
}