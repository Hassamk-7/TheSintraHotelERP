-- Add migration to history table
INSERT INTO __EFMigrationsHistory (MigrationId, ProductVersion) 
VALUES ('20251019104314_CreateRoomBlockedAndRoomTaxTables', '9.0.9');

-- Verify the insertion
SELECT * FROM __EFMigrationsHistory ORDER BY MigrationId;
