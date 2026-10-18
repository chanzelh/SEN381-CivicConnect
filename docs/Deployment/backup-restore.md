
# Backup & Restore Test (#83, NFR-014)

**Date:** 17 October 2026  
**Source:** `civicconnect_staging` (v3.0-rc1)  
**Tool:** pgAdmin (pg_dump/pg_restore, custom format)  
**Backup stored:** Outside the repository (contains password hashes)

## Expected Result

Every selected table in the restored database should have the same row count as the original staging database. A sample request should also match field-for-field.

## Results

| Table | Before (Staging) | After (Restored) | Match |
| --- | ---: | ---: | --- |
| users | 3 | 3 | Yes |
| service_requests | 0 | 0 | Yes |
| request_status_history | 0 | 0 | Yes |
| request_comments | 0 | 0 | Yes |
| notifications | 0 | 0 | Yes |
| Sample request (title, status) | No records | No records | N/A |

**Outcome:** All five tables had identical row counts before and after restoration. The sample request query returned no records in either database. The row-count comparison was successful, but recovery of an actual service request could not be verified because the table was empty.

## Limitations

- Backup was performed manually rather than automatically.
- Restoration was tested on the same machine.
- The dataset contained only three users.
- Production would require regular automated off-site backups and a tested recovery time.
