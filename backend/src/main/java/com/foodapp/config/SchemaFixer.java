package com.foodapp.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Self-healing schema guard.
 *
 * Runs on every backend startup, before the data seeder, and removes columns
 * that don't belong to this project's entities but can end up lingering in a
 * local database from an earlier schema attempt (for example a stray
 * `placed_at` column on `orders`, which caused
 * "Field 'placed_at' doesn't have a default value" on every insert).
 *
 * Hibernate's ddl-auto=update only ever ADDS columns — it never removes ones
 * that no longer exist on the entity — so without this, a single leftover
 * column can silently break every future order placement, and running a
 * one-off DROP TABLE manually doesn't help if something (like a leftover
 * schema.sql) keeps recreating it. This runs every time, so it keeps fixing
 * itself regardless of what put the column there.
 *
 * Safe by design: it only ever drops a column after confirming (via
 * information_schema) that it actually exists, and only for tables/columns
 * explicitly listed below. It never touches data in columns that ARE part of
 * the current entities.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class SchemaFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    // table -> known-stale column names that must not exist on that table.
    private static final String[][] STALE_COLUMNS = {
            {"orders", "placed_at"},
            {"order_items", "placed_at"},
    };

    @Override
    public void run(String... args) {
        for (String[] entry : STALE_COLUMNS) {
            dropColumnIfExists(entry[0], entry[1]);
        }
    }

    private void dropColumnIfExists(String table, String column) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM information_schema.columns " +
                    "WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
                    Integer.class, table, column
            );
            if (count != null && count > 0) {
                jdbcTemplate.execute("ALTER TABLE " + table + " DROP COLUMN " + column);
                System.out.println("[SchemaFixer] Dropped stale column " + table + "." + column
                        + " — it doesn't belong to any current entity.");
            }
        } catch (Exception e) {
            // Table doesn't exist yet on a brand-new database — Hibernate will create it
            // correctly from the entities, so there's nothing to fix here. Safe to ignore.
        }
    }
}
