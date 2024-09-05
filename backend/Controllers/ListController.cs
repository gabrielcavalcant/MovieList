using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

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

        //[HttpGet]
        //public async Task<IActionResult> GetLists()
        //{
        //    var lists = await _context.Lists
        //        .Include(l => l.FavoriteLists)
        //        .ThenInclude(fl => fl.Favorite)
        //        .ToListAsync();
        //    return Ok(lists);
        //}

        [HttpPost]
        public async Task<IActionResult> CreateList([FromBody] List list)
        {

            _context.Lists.AddRange(list);
            await _context.SaveChangesAsync();
            return Ok(list);
        }

        //[HttpPost("{listId}/add-favorite/{favoriteId}")]
        //public async Task<IActionResult> AddFavoriteToList(int listId, int favoriteId)
        //{
        //    var list = await _context.Lists.FindAsync(listId);
        //    if (list == null)
        //    {
        //        return NotFound("List not found");
        //    }

        //    var favorite = await _context.Favorites.FindAsync(favoriteId);
        //    if (favorite == null)
        //    {
        //        return NotFound("Favorite not found");
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

        //[HttpDelete("{listId}/remove-favorite/{favoriteId}")]
        //public async Task<IActionResult> RemoveFavoriteFromList(int listId, int favoriteId)
        //{
        //    var favoriteList = await _context.FavoriteLists
        //        .FirstOrDefaultAsync(fl => fl.ListId == listId && fl.FavoriteId == favoriteId);

        //    if (favoriteList == null)
        //    {
        //        return NotFound("Favorite not found in the list");
        //    }

        //    _context.FavoriteLists.Remove(favoriteList);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}
    }
}
