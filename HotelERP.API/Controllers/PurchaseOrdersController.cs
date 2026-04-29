using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelERP.API.Data;
using HotelERP.API.Models;
using HotelERP.API.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HotelERP.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseOrdersController : BaseController
    {
        private readonly HotelDbContext _context;

        public PurchaseOrdersController(HotelDbContext context)
        {
            _context = context;
        }

        // GET: api/PurchaseOrders
        [HttpGet]
        public async Task<IActionResult> GetPurchaseOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 200)
        {
            try
            {
                var query = _context.PurchaseOrders
                    .Include(p => p.Supplier)
                    .Include(p => p.Items)
                    .AsQueryable();

                var totalCount = await query.CountAsync();
                var orders = await query
                    .OrderByDescending(p => p.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = orders,
                    totalCount = totalCount,
                    page = page,
                    pageSize = pageSize
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching purchase orders: {ex.Message}");
            }
        }

        // GET: api/PurchaseOrders/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPurchaseOrder(int id)
        {
            try
            {
                var purchaseOrder = await _context.PurchaseOrders
                    .Include(p => p.Supplier)
                    .Include(p => p.Items)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (purchaseOrder == null)
                {
                    return HandleNotFound("Purchase order not found");
                }

                return Ok(new
                {
                    success = true,
                    data = purchaseOrder
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching purchase order: {ex.Message}");
            }
        }

        // POST: api/PurchaseOrders
        [HttpPost]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] PurchaseOrderDTO dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check for duplicate PO number
                var existingPO = await _context.PurchaseOrders
                    .FirstOrDefaultAsync(p => p.PONumber == dto.PONumber);

                if (existingPO != null)
                {
                    return BadRequest(new { message = "PO number already exists" });
                }

                var purchaseOrder = new PurchaseOrder
                {
                    PONumber = dto.PONumber,
                    SupplierId = dto.SupplierId,
                    OrderDate = dto.OrderDate,
                    ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
                    ActualDeliveryDate = dto.ActualDeliveryDate,
                    Status = dto.Status,
                    SubTotal = dto.SubTotal,
                    TaxAmount = dto.TaxAmount,
                    TotalAmount = dto.TotalAmount,
                    OrderedBy = dto.OrderedBy,
                    ApprovedBy = dto.ApprovedBy,
                    ApprovalDate = dto.ApprovalDate,
                    Terms = dto.Terms,
                    Remarks = dto.Remarks,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.PurchaseOrders.Add(purchaseOrder);
                await _context.SaveChangesAsync();

                // Add items if provided
                if (dto.Items != null && dto.Items.Count > 0)
                {
                    foreach (var itemDto in dto.Items)
                    {
                        var item = new PurchaseOrderItem
                        {
                            PurchaseOrderId = purchaseOrder.Id,
                            ItemId = itemDto.ItemId,
                            Quantity = itemDto.Quantity,
                            UnitPrice = itemDto.UnitPrice,
                            TotalPrice = itemDto.TotalPrice,
                            Specifications = itemDto.Specifications,
                            Remarks = itemDto.Remarks,
                            CreatedAt = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.PurchaseOrderItems.Add(item);
                    }
                    await _context.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetPurchaseOrder), new { id = purchaseOrder.Id }, new
                {
                    success = true,
                    data = purchaseOrder,
                    message = "Purchase order created successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error creating purchase order: {ex.Message}");
            }
        }

        // PUT: api/PurchaseOrders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePurchaseOrder(int id, [FromBody] PurchaseOrderDTO dto)
        {
            try
            {
                if (id != dto.Id)
                {
                    return BadRequest(new { message = "ID mismatch" });
                }

                var existingPO = await _context.PurchaseOrders
                    .Include(p => p.Items)
                    .FirstOrDefaultAsync(p => p.Id == id);
                
                if (existingPO == null)
                {
                    return HandleNotFound("Purchase order not found");
                }

                // Update fields
                existingPO.PONumber = dto.PONumber ?? existingPO.PONumber;
                existingPO.SupplierId = dto.SupplierId;
                existingPO.OrderDate = dto.OrderDate;
                existingPO.ExpectedDeliveryDate = dto.ExpectedDeliveryDate;
                existingPO.ActualDeliveryDate = dto.ActualDeliveryDate;
                existingPO.Status = dto.Status ?? existingPO.Status;
                existingPO.SubTotal = dto.SubTotal;
                existingPO.TaxAmount = dto.TaxAmount;
                existingPO.TotalAmount = dto.TotalAmount;
                existingPO.OrderedBy = dto.OrderedBy ?? existingPO.OrderedBy;
                existingPO.ApprovedBy = dto.ApprovedBy ?? existingPO.ApprovedBy;
                existingPO.ApprovalDate = dto.ApprovalDate;
                existingPO.Terms = dto.Terms ?? existingPO.Terms;
                existingPO.Remarks = dto.Remarks ?? existingPO.Remarks;
                existingPO.UpdatedAt = DateTime.UtcNow;

                _context.PurchaseOrders.Update(existingPO);
                await _context.SaveChangesAsync();

                // Handle items - delete old items and add new ones
                if (dto.Items != null)
                {
                    var existingItems = await _context.PurchaseOrderItems
                        .Where(i => i.PurchaseOrderId == id)
                        .ToListAsync();
                    
                    _context.PurchaseOrderItems.RemoveRange(existingItems);
                    await _context.SaveChangesAsync();

                    foreach (var itemDto in dto.Items)
                    {
                        var item = new PurchaseOrderItem
                        {
                            PurchaseOrderId = id,
                            ItemId = itemDto.ItemId,
                            Quantity = itemDto.Quantity,
                            UnitPrice = itemDto.UnitPrice,
                            TotalPrice = itemDto.TotalPrice,
                            Specifications = itemDto.Specifications,
                            Remarks = itemDto.Remarks,
                            CreatedAt = DateTime.UtcNow,
                            IsActive = true
                        };
                        _context.PurchaseOrderItems.Add(item);
                    }
                    await _context.SaveChangesAsync();
                }

                return HandleSuccess(new
                {
                    success = true,
                    data = existingPO,
                    message = "Purchase order updated successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error updating purchase order: {ex.Message}");
            }
        }

        // DELETE: api/PurchaseOrders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchaseOrder(int id)
        {
            try
            {
                var purchaseOrder = await _context.PurchaseOrders.FindAsync(id);
                if (purchaseOrder == null)
                {
                    return HandleNotFound("Purchase order not found");
                }

                _context.PurchaseOrders.Remove(purchaseOrder);
                await _context.SaveChangesAsync();

                return HandleSuccess(new
                {
                    success = true,
                    message = "Purchase order deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error deleting purchase order: {ex.Message}");
            }
        }

        // GET: api/PurchaseOrders/by-status/{status}
        [HttpGet("by-status/{status}")]
        public async Task<IActionResult> GetPurchaseOrdersByStatus(string status)
        {
            try
            {
                var orders = await _context.PurchaseOrders
                    .Include(p => p.Supplier)
                    .Include(p => p.Items)
                    .Where(p => p.Status == status)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = orders,
                    count = orders.Count
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching purchase orders by status: {ex.Message}");
            }
        }

        // GET: api/PurchaseOrders/by-supplier/{supplierId}
        [HttpGet("by-supplier/{supplierId}")]
        public async Task<IActionResult> GetPurchaseOrdersBySupplier(int supplierId)
        {
            try
            {
                var orders = await _context.PurchaseOrders
                    .Include(p => p.Supplier)
                    .Include(p => p.Items)
                    .Where(p => p.SupplierId == supplierId)
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = orders,
                    count = orders.Count
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching purchase orders by supplier: {ex.Message}");
            }
        }

        // GET: api/PurchaseOrders/summary
        [HttpGet("summary/stats")]
        public async Task<IActionResult> GetPurchaseOrdersSummary()
        {
            try
            {
                var totalOrders = await _context.PurchaseOrders.CountAsync();
                var pendingOrders = await _context.PurchaseOrders.CountAsync(p => p.Status == "Pending");
                var approvedOrders = await _context.PurchaseOrders.CountAsync(p => p.Status == "Approved");
                var receivedOrders = await _context.PurchaseOrders.CountAsync(p => p.Status == "Received");
                var totalValue = await _context.PurchaseOrders.SumAsync(p => p.TotalAmount);

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        totalOrders = totalOrders,
                        pendingOrders = pendingOrders,
                        approvedOrders = approvedOrders,
                        receivedOrders = receivedOrders,
                        totalValue = totalValue
                    }
                });
            }
            catch (Exception ex)
            {
                return HandleError($"Error fetching summary: {ex.Message}");
            }
        }
    }
}
