using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ListsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Lists
        [HttpGet]
        public async Task<IActionResult> GetLists()
        {
            var lists = await _context.Listas
                .ToListAsync();
            return Ok(lists);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetListById(int id)
        {
            // Busca a lista pelo ID e carrega os favoritos associados
            var list = await _context.Listas
                .Include(l => l.FavoriteMovies) // Carrega os favoritos associados à lista
                .FirstOrDefaultAsync(l => l.Id == id);

            // Verifica se a lista foi encontrada
            if (list == null)
            {
                return NotFound(); // Retorna 404 se a lista não for encontrada
            }

            return Ok(list); // Retorna 200 com a lista e seus favoritos
        }



        //// GET: api/Lists/{id}
        //[HttpGet("{id}")]
        //public async Task<IActionResult> GetListById(int id)
        //{
        //    var list = await _context.Listas
        //        .Include(l => l.FavoriteLists)
        //        .ThenInclude(fl => fl.Favorite)
        //        .FirstOrDefaultAsync(l => l.Id == id);

        //    if (list == null)
        //    {
        //        return NotFound("Lista não encontrada.");
        //    }

        //    return Ok(list);
        //}

        // POST: api/Lists
        [HttpPost]
        public async Task<IActionResult> CreateList([FromBody] Lista list)
        {
            if (list == null)
            {
                return BadRequest("Dados inválidos.");
            }

            // Buscando filmes já favoritados
            var favoriteMovies = _context.Favorites.ToList();

            if (favoriteMovies == null || !favoriteMovies.Any())
            {
                return BadRequest("Nenhum filme favoritado para adicionar à lista.");
            }

            // Associando filmes favoritados à lista
            foreach (var favorite in favoriteMovies)
            {
                list.FavoriteMovies.Add(favorite); // Certifique-se de que `FavoriteMovies` está corretamente definida
            }

            _context.Listas.Add(list);
            await _context.SaveChangesAsync();

            return Ok(list);
        }
        // PUT: api/Lists/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateList(int id, [FromBody] Lista updatedList)
        {
            if (id != updatedList.Id)
            {
                return BadRequest("ID da lista não corresponde.");
            }

            var existingList = await _context.Listas.FindAsync(id);
            if (existingList == null)
            {
                return NotFound("Lista não encontrada.");
            }

            existingList.Name = updatedList.Name;
            // Atualizar outros campos, se houver

            _context.Listas.Update(existingList);
            await _context.SaveChangesAsync();

            return Ok(existingList);
        }

        // DELETE: api/Lists/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            var list = await _context.Listas.FindAsync(id);
            if (list == null)
            {
                return NotFound("Lista não encontrada.");
            }

            _context.Listas.Remove(list);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Lists/{listId}/add-favorite/{favoriteId}
        //[HttpPost("{listId}/add-favorite/{favoriteId}")]
        //public async Task<IActionResult> AddFavoriteToList(int listId, int favoriteId)
        //{
        //    var list = await _context.Listas.FindAsync(listId);
        //    if (list == null)
        //    {
        //        return NotFound("Lista não encontrada.");
        //    }

        //    var favorite = await _context.Favorites.FindAsync(favoriteId);
        //    if (favorite == null)
        //    {
        //        return NotFound("Favorito não encontrado.");
        //    }

        //    var favoriteList = new FavoriteList
        //    {
        //        ListId = listId,
        //        FavoriteId = favoriteId
        //    };

        //    _context.FavoriteLists.Add(favoriteList);
        //    await _context.SaveChangesAsync();

        //    return Ok(favoriteList);
        //}

        // DELETE: api/Lists/{listId}/remove-favorite/{favoriteId}
        //[HttpDelete("{listId}/remove-favorite/{favoriteId}")]
        //public async Task<IActionResult> RemoveFavoriteFromList(int listId, int favoriteId)
        //{
        //    var favoriteList = await _context.FavoriteLists
        //        .FirstOrDefaultAsync(fl => fl.ListId == listId && fl.FavoriteId == favoriteId);

        //    if (favoriteList == null)
        //    {
        //        return NotFound("Favorito não encontrado na lista.");
        //    }

        //    _context.FavoriteLists.Remove(favoriteList);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        // POST: api/Lists/{listId}/add-favorites
        //[HttpPost("{listId}/add-favorites")]
        //public async Task<IActionResult> AddFavoritesToList(int listId, [FromBody] List<int> favoriteIds)
        //{
        //    // Verificar se a lista existe
        //    var list = await _context.Listas.FindAsync(listId);
        //    if (list == null)
        //    {
        //        return NotFound("Lista não encontrada.");
        //    }

        //    // Verificar se os favoritos existem
        //    var favorites = await _context.Favorites
        //        .Where(f => favoriteIds.Contains(f.Id))
        //        .ToListAsync();

        //    if (!favorites.Any())
        //    {
        //        return BadRequest("Nenhum favorito válido encontrado.");
        //    }

        //    // Adicionar os favoritos à lista
        //    foreach (var favorite in favorites)
        //    {
        //        if (!_context.FavoriteLists.Any(fl => fl.FavoriteId == favorite.Id && fl.ListId == listId))
        //        {
        //            var favoriteList = new FavoriteList
        //            {
        //                ListId = listId,
        //                FavoriteId = favorite.Id
        //            };
        //            _context.FavoriteLists.Add(favoriteList);
        //        }
        //    }

        //    // Salvar as mudanças
        //    await _context.SaveChangesAsync();
        //    return Ok("Favoritos adicionados à lista com sucesso.");
        //}
    }
}