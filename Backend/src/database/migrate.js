/**
 * GV Florida Transport - Database Migration
 * Creates all tables for the Bus Operation Ecosystem
 */
const db = require('./connection');

async function migrate() {
    console.log('Running database migrations...');

    // Users table (passengers)
    await db.schema.createTableIfNotExists('users', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('email').unique().notNullable();
        table.string('phone', 20).unique();
        table.string('password_hash').notNullable();
        table.string('first_name', 100).notNullable();
        table.string('last_name', 100).notNullable();
        table.date('date_of_birth');
        table.string('profile_image');
        table.string('auth_provider', 20).defaultTo('email'); // email, google, facebook
        table.decimal('wallet_balance', 12, 2).defaultTo(0);
        table.integer('loyalty_points').defaultTo(0);
        table.boolean('is_verified').defaultTo(false);
        table.boolean('is_active').defaultTo(true);
        table.boolean('biometric_enabled').defaultTo(false);
        table.jsonb('preferences').defaultTo('{}');
        table.timestamp('last_login');
        table.timestamps(true, true);
        table.timestamp('deleted_at');
    });

    // Employees table (drivers, conductors, inspectors, staff)
    await db.schema.createTableIfNotExists('employees', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('employee_id', 20).unique().notNullable();
        table.string('email').unique().notNullable();
        table.string('phone', 20);
        table.string('password_hash').notNullable();
        table.string('first_name', 100).notNullable();
        table.string('last_name', 100).notNullable();
        table.enum('role', ['driver', 'conductor', 'inspector', 'station_staff', 'admin', 'manager', 'hr', 'finance']).notNullable();
        table.string('license_number', 50);
        table.date('license_expiry');
        table.string('profile_image');
        table.decimal('base_salary', 12, 2);
        table.enum('salary_type', ['fixed', 'per_trip', 'per_hour', 'commission']).defaultTo('fixed');
        table.jsonb('documents').defaultTo('[]'); // licenses, medical certs, training records
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });

    // Terminals
    await db.schema.createTableIfNotExists('terminals', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.string('code', 10).unique().notNullable();
        table.text('address');
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        table.string('contact_number', 20);
        table.string('manager_name');
        table.jsonb('amenities').defaultTo('[]');
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });

    // Buses (fleet)
    await db.schema.createTableIfNotExists('buses', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('bus_number', 20).unique().notNullable();
        table.string('plate_number', 15).unique().notNullable();
        table.enum('bus_type', ['deluxe', 'super_deluxe', 'first_class']).notNullable();
        table.integer('total_seats').notNullable();
        table.jsonb('seat_layout'); // JSON seat map configuration
        table.uuid('home_terminal_id').references('id').inTable('terminals');
        table.enum('status', ['active', 'maintenance', 'decommissioned']).defaultTo('active');
        table.date('last_maintenance');
        table.date('next_maintenance');
        table.integer('mileage');
        table.jsonb('amenities').defaultTo('[]'); // wifi, outlets, entertainment
        table.string('gps_device_id');
        table.timestamps(true, true);
    });

    // Routes
    await db.schema.createTableIfNotExists('routes', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('route_code', 20).unique().notNullable();
        table.string('name').notNullable();
        table.uuid('origin_terminal_id').references('id').inTable('terminals');
        table.uuid('destination_terminal_id').references('id').inTable('terminals');
        table.string('origin_name');
        table.string('destination_name');
        table.jsonb('stops').defaultTo('[]'); // intermediate stops with coordinates
        table.decimal('distance_km', 8, 2);
        table.integer('estimated_duration_minutes');
        table.decimal('base_fare', 10, 2);
        table.jsonb('fare_matrix').defaultTo('{}'); // fare by bus type
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });

    // Trips (scheduled trips)
    await db.schema.createTableIfNotExists('trips', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('trip_number', 20).unique().notNullable();
        table.uuid('route_id').references('id').inTable('routes').notNullable();
        table.uuid('bus_id').references('id').inTable('buses').notNullable();
        table.uuid('driver_id').references('id').inTable('employees');
        table.uuid('conductor_id').references('id').inTable('employees');
        table.timestamp('scheduled_departure').notNullable();
        table.timestamp('scheduled_arrival');
        table.timestamp('actual_departure');
        table.timestamp('actual_arrival');
        table.enum('status', ['scheduled', 'boarding', 'departed', 'in_transit', 'arrived', 'cancelled']).defaultTo('scheduled');
        table.integer('available_seats');
        table.integer('booked_seats').defaultTo(0);
        table.decimal('current_latitude', 10, 7);
        table.decimal('current_longitude', 10, 7);
        table.decimal('current_speed', 6, 2);
        table.timestamps(true, true);
    });

    // Bookings
    await db.schema.createTableIfNotExists('bookings', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('booking_reference', 20).unique().notNullable();
        table.uuid('user_id').references('id').inTable('users');
        table.uuid('trip_id').references('id').inTable('trips').notNullable();
        table.string('seat_number', 10);
        table.enum('status', ['reserved', 'confirmed', 'boarded', 'completed', 'cancelled', 'no_show']).defaultTo('reserved');
        table.decimal('fare_amount', 10, 2).notNullable();
        table.decimal('baggage_fee', 10, 2).defaultTo(0);
        table.decimal('total_amount', 10, 2).notNullable();
        table.string('passenger_name');
        table.string('passenger_phone', 20);
        table.string('qr_code'); // QR code data for ticket validation
        table.jsonb('baggage').defaultTo('{}'); // type, quantity, declared value
        table.enum('booking_source', ['app', 'kiosk', 'counter', 'web']).defaultTo('app');
        table.timestamp('reserved_until'); // 15-minute hold
        table.timestamp('boarded_at');
        table.timestamps(true, true);
    });

    // Payments
    await db.schema.createTableIfNotExists('payments', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('transaction_id', 30).unique().notNullable();
        table.uuid('user_id').references('id').inTable('users');
        table.uuid('booking_id').references('id').inTable('bookings');
        table.uuid('processed_by').references('id').inTable('employees');
        table.decimal('amount', 12, 2).notNullable();
        table.string('currency', 3).defaultTo('PHP');
        table.enum('payment_method', ['gcash', 'paymaya', 'qrph', 'visa', 'mastercard', 'cash', 'wallet']).notNullable();
        table.enum('payment_type', ['ticket_purchase', 'wallet_topup', 'baggage_fee', 'refund']).notNullable();
        table.enum('status', ['pending', 'completed', 'failed', 'refunded']).defaultTo('pending');
        table.string('gateway_reference'); // external payment gateway reference
        table.string('receipt_number', 30);
        table.boolean('receipt_printed').defaultTo(false);
        table.jsonb('metadata').defaultTo('{}');
        table.timestamps(true, true);
    });

    // Wallet transactions
    await db.schema.createTableIfNotExists('wallet_transactions', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users').notNullable();
        table.enum('type', ['credit', 'debit']).notNullable();
        table.decimal('amount', 12, 2).notNullable();
        table.decimal('balance_after', 12, 2).notNullable();
        table.string('description');
        table.uuid('payment_id').references('id').inTable('payments');
        table.uuid('booking_id').references('id').inTable('bookings');
        table.timestamps(true, true);
    });

    // Ratings & reviews
    await db.schema.createTableIfNotExists('ratings', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users').notNullable();
        table.uuid('trip_id').references('id').inTable('trips').notNullable();
        table.uuid('booking_id').references('id').inTable('bookings');
        table.integer('driver_rating').checkBetween([1, 5]);
        table.integer('conductor_rating').checkBetween([1, 5]);
        table.integer('cleanliness_rating').checkBetween([1, 5]);
        table.integer('punctuality_rating').checkBetween([1, 5]);
        table.integer('overall_rating').checkBetween([1, 5]);
        table.text('comment');
        table.timestamps(true, true);
    });

    // Geo-tags (passenger geo-tagging by staff)
    await db.schema.createTableIfNotExists('geo_tags', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('trip_id').references('id').inTable('trips').notNullable();
        table.uuid('tagged_by').references('id').inTable('employees').notNullable();
        table.uuid('passenger_id').references('id').inTable('users');
        table.decimal('latitude', 10, 7).notNullable();
        table.decimal('longitude', 10, 7).notNullable();
        table.text('notes');
        table.enum('reason', ['boarding', 'security', 'emergency', 'other']).defaultTo('boarding');
        table.timestamps(true, true);
    });

    // Shift logs
    await db.schema.createTableIfNotExists('shift_logs', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('employee_id').references('id').inTable('employees').notNullable();
        table.uuid('trip_id').references('id').inTable('trips');
        table.timestamp('clock_in');
        table.timestamp('clock_out');
        table.decimal('clock_in_lat', 10, 7);
        table.decimal('clock_in_lng', 10, 7);
        table.integer('passenger_count').defaultTo(0);
        table.decimal('total_collections', 12, 2).defaultTo(0);
        table.integer('receipts_printed').defaultTo(0);
        table.text('notes');
        table.timestamps(true, true);
    });

    // Payroll
    await db.schema.createTableIfNotExists('payroll', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('employee_id').references('id').inTable('employees').notNullable();
        table.date('period_start').notNullable();
        table.date('period_end').notNullable();
        table.decimal('base_pay', 12, 2);
        table.decimal('trip_pay', 12, 2).defaultTo(0);
        table.decimal('overtime_pay', 12, 2).defaultTo(0);
        table.decimal('bonus', 12, 2).defaultTo(0);
        table.decimal('deductions', 12, 2).defaultTo(0);
        table.decimal('tax', 12, 2).defaultTo(0);
        table.decimal('loan_deduction', 12, 2).defaultTo(0);
        table.decimal('net_pay', 12, 2);
        table.enum('status', ['draft', 'approved', 'paid']).defaultTo('draft');
        table.date('paid_date');
        table.timestamps(true, true);
    });

    // Maintenance records
    await db.schema.createTableIfNotExists('maintenance_records', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('bus_id').references('id').inTable('buses').notNullable();
        table.enum('type', ['preventive', 'corrective', 'breakdown']).notNullable();
        table.text('description').notNullable();
        table.decimal('cost', 12, 2);
        table.date('scheduled_date');
        table.date('completed_date');
        table.enum('status', ['scheduled', 'in_progress', 'completed']).defaultTo('scheduled');
        table.uuid('reported_by').references('id').inTable('employees');
        table.jsonb('photos').defaultTo('[]');
        table.timestamps(true, true);
    });

    // Incidents
    await db.schema.createTableIfNotExists('incidents', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('trip_id').references('id').inTable('trips');
        table.uuid('reported_by').references('id').inTable('employees').notNullable();
        table.enum('type', ['accident', 'breakdown', 'unruly_passenger', 'medical', 'security', 'other']).notNullable();
        table.text('description').notNullable();
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        table.jsonb('photos').defaultTo('[]');
        table.enum('severity', ['low', 'medium', 'high', 'critical']).defaultTo('medium');
        table.enum('status', ['open', 'investigating', 'resolved', 'closed']).defaultTo('open');
        table.timestamps(true, true);
    });

    // Lost & Found
    await db.schema.createTableIfNotExists('lost_found', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('trip_id').references('id').inTable('trips');
        table.uuid('reported_by_user').references('id').inTable('users');
        table.uuid('found_by_staff').references('id').inTable('employees');
        table.text('description').notNullable();
        table.jsonb('photos').defaultTo('[]');
        table.enum('status', ['reported', 'found', 'matched', 'returned', 'unclaimed']).defaultTo('reported');
        table.string('contact_info');
        table.timestamps(true, true);
    });

    // Promotions & loyalty
    await db.schema.createTableIfNotExists('promotions', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.string('code', 30).unique().notNullable();
        table.string('name').notNullable();
        table.text('description');
        table.enum('type', ['discount_percent', 'discount_fixed', 'free_ride', 'points_multiplier']).notNullable();
        table.decimal('value', 10, 2);
        table.integer('max_uses');
        table.integer('used_count').defaultTo(0);
        table.date('valid_from');
        table.date('valid_until');
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });

    // Notifications
    await db.schema.createTableIfNotExists('notifications', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users');
        table.uuid('employee_id').references('id').inTable('employees');
        table.string('title').notNullable();
        table.text('message').notNullable();
        table.enum('type', ['booking', 'payment', 'trip_update', 'promotion', 'system', 'sos', 'announcement']);
        table.boolean('is_read').defaultTo(false);
        table.jsonb('data').defaultTo('{}');
        table.timestamps(true, true);
    });

    // Audit log
    await db.schema.createTableIfNotExists('audit_logs', (table) => {
        table.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
        table.uuid('user_id').references('id').inTable('users');
        table.uuid('employee_id').references('id').inTable('employees');
        table.string('action').notNullable();
        table.string('resource_type');
        table.uuid('resource_id');
        table.jsonb('old_values');
        table.jsonb('new_values');
        table.string('ip_address', 45);
        table.text('user_agent');
        table.timestamps(true, true);
    });

    console.log('All migrations completed successfully!');
    process.exit(0);
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
