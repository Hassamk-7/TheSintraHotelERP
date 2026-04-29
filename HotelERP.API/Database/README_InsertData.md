# Insert Sample Stock Items - Guide

## Overview
This guide explains how to insert 15 sample stock items into the `ItemMasters` table for testing the Stock Management module.

## Database Details

### Table: ItemMasters
- **Database**: HotelERP (or your configured database name)
- **Schema**: dbo
- **Records to Insert**: 15 items across 4 categories

### Categories Included:
1. **Food & Beverage** (6 items)
   - Basmati Rice
   - Chicken (Fresh)
   - Cooking Oil
   - Wheat Flour
   - Sugar
   - Tea Leaves

2. **Housekeeping** (4 items)
   - Toilet Paper
   - Bed Sheets
   - Hand Soap
   - Detergent Powder

3. **Office Supplies** (3 items)
   - A4 Paper
   - Ballpoint Pens
   - Notebooks

4. **Maintenance** (2 items)
   - Light Bulbs (LED)
   - Paint (White)

## How to Run the Script

### Option 1: Using SQL Server Management Studio (SSMS)

1. **Open SQL Server Management Studio**
   - Launch SSMS on your computer
   - Connect to your SQL Server instance

2. **Open the SQL Script**
   - File → Open → File
   - Navigate to: `E:\HotelERP\HotelERP.API\Database\InsertSampleStockItems.sql`
   - Click Open

3. **Select the Database**
   - In the toolbar, select your database from the dropdown (e.g., "HotelERP")

4. **Execute the Script**
   - Press `F5` or click "Execute" button
   - Wait for completion message

5. **Verify the Data**
   - The script includes verification queries at the end
   - You should see:
     - 15 rows inserted
     - Summary by category
     - Low stock items report

### Option 2: Using Visual Studio

1. **Open Visual Studio**
2. **View → SQL Server Object Explorer**
3. **Locate your database** → Right-click → New Query
4. **Copy and paste the SQL script** from `InsertSampleStockItems.sql`
5. **Execute** (Ctrl + Shift + E)

### Option 3: Using Command Line (sqlcmd)

```bash
sqlcmd -S YOUR_SERVER_NAME -d HotelERP -i "E:\HotelERP\HotelERP.API\Database\InsertSampleStockItems.sql"
```

Replace `YOUR_SERVER_NAME` with your SQL Server instance name (e.g., `localhost\SQLEXPRESS`)

## Data Details

### Sample Item Structure:
```
Id: 1
Name: Basmati Rice
Code: RICE001
Category: Food & Beverage
Unit: Kg
PurchasePrice: 180.00
SalePrice: 220.00
MinStockLevel: 50
MaxStockLevel: 500
CurrentStock: 150
Supplier: Zubair Foods & Supplies
Brand: Dawat
IsPerishable: No
StorageLocation: Kitchen Store - Shelf A
IsActive: Yes
```

### Stock Levels:
- **In Stock**: Items with CurrentStock > MinStockLevel
- **Low Stock**: Items with CurrentStock ≤ MinStockLevel
- **Out of Stock**: Items with CurrentStock = 0

Current data has:
- ✅ 13 items in stock
- ⚠️ 2 items with low stock (can be adjusted as needed)
- ❌ 0 items out of stock

## After Insertion

### Test in Stock Management UI:

1. **Navigate to**: Admin Panel → Inventory → Stock Management
2. **Verify**:
   - Total Items: Should show 15
   - Stock Value: Should calculate correctly
   - Low Stock: Should show 0-2 items
   - Out of Stock: Should show 0

3. **Test CRUD Operations**:
   - ✅ Add a new item
   - ✅ Edit an existing item
   - ✅ Delete an item
   - ✅ Adjust stock (+/-)

4. **Search & Filter**:
   - Search by item name
   - Filter by category
   - Verify all 15 items appear

## Modifying the Data

### To Change Stock Levels:
Edit the `CurrentStock` value in the INSERT statement:
```sql
CurrentStock: 150,  -- Change this number
```

### To Add More Items:
1. Copy a complete INSERT block
2. Increment the `Id` value
3. Update all fields accordingly
4. Add the new INSERT statement before the final semicolon

### To Change Suppliers:
Update the `Supplier` field with your actual supplier names

## Troubleshooting

### Error: "Cannot insert duplicate key"
- **Cause**: Items with IDs 1-15 already exist
- **Solution**: 
  - Delete existing items first:
    ```sql
    DELETE FROM [dbo].[ItemMasters] WHERE Id BETWEEN 1 AND 15;
    ```
  - Then run the insert script

### Error: "Invalid column name"
- **Cause**: Table structure doesn't match
- **Solution**: Verify the ItemMasters table has all required columns

### Error: "Login failed"
- **Cause**: SQL Server authentication issue
- **Solution**: Check your connection string and credentials

## Verification Queries

### View All Inserted Items:
```sql
SELECT * FROM [dbo].[ItemMasters] WHERE Id BETWEEN 1 AND 15;
```

### Count by Category:
```sql
SELECT Category, COUNT(*) FROM [dbo].[ItemMasters] WHERE Id BETWEEN 1 AND 15 GROUP BY Category;
```

### Total Inventory Value:
```sql
SELECT SUM(CurrentStock * PurchasePrice) as TotalValue FROM [dbo].[ItemMasters] WHERE Id BETWEEN 1 AND 15;
```

### Low Stock Items:
```sql
SELECT Name, CurrentStock, MinStockLevel FROM [dbo].[ItemMasters] 
WHERE Id BETWEEN 1 AND 15 AND CurrentStock <= MinStockLevel;
```

## Next Steps

After successfully inserting the data:

1. **Test Stock Management Page**
   - Verify all 15 items load
   - Test add/edit/delete operations
   - Test stock adjustments

2. **Test Other Inventory Modules**
   - Inventory Dashboard
   - Purchase Orders
   - Suppliers
   - Stock Alerts
   - Inventory Reports

3. **Adjust Data as Needed**
   - Modify stock levels
   - Add more items
   - Update supplier information

## Support

If you encounter any issues:
1. Check the error message in SSMS
2. Verify database connection
3. Ensure all required columns exist in ItemMasters table
4. Check that the database is not in read-only mode

---

**Created**: 2025-11-17
**Database**: HotelERP
**Records**: 15 items across 4 categories
**Status**: Ready to use
