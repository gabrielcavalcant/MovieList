﻿using System.Collections.Generic;

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
        public bool IsFavorite { get; set; }

        // Relação N -> N com List, agora opcional
        public ICollection<Lista> Lists { get; set; } = new List<Lista>();
    }
}