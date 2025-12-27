# Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ restaurants : "owns"
    users ||--o{ orders : "places"
    users ||--o{ reviews : "writes"
    users ||--o{ user_addresses : "has"
    users ||--o{ user_devices : "has"
    users ||--o{ user_favorites : "favorites"
    users ||--o{ refresh_tokens : "has"
    users ||--o{ notifications : "receives"
    users ||--o| wallets : "has"
    users ||--o| carts : "has"
    users ||--o| drivers : "is"
    users ||--o{ payments : "makes"
    users ||--o{ voucher_usages : "uses"
    users ||--o{ order_status_history : "changes"

    restaurants ||--o{ menu_categories : "has"
    restaurants ||--o{ menu_items : "offers"
    restaurants ||--o{ orders : "receives"
    restaurants ||--o{ reviews : "receives"
    restaurants ||--o{ vouchers : "creates"
    restaurants ||--o{ restaurant_category_mappings : "belongs_to"
    restaurants ||--o{ operating_hours : "has"
    restaurants ||--o{ carts : "has"
    restaurants ||--o{ user_favorites : "favorited_by"

    menu_categories ||--o{ menu_items : "contains"

    menu_items ||--o{ menu_item_options : "has"
    menu_items ||--o{ cart_items : "added_to"
    menu_items ||--o{ order_items : "ordered_as"

    carts ||--o{ cart_items : "contains"

    orders ||--o{ order_items : "contains"
    orders ||--o| deliveries : "has"
    orders ||--o| payments : "has"
    orders ||--o| reviews : "has"
    orders ||--o{ order_status_history : "tracks"
    orders ||--o{ voucher_usages : "applies"
    orders }o--o| vouchers : "uses"
    orders }o--|| user_addresses : "delivers_to"

    drivers ||--o{ deliveries : "performs"
    drivers ||--o{ driver_locations : "tracks"
    drivers ||--o{ reviews : "receives"

    reviews ||--o{ review_images : "has"

    wallets ||--o{ wallet_transactions : "has"

    vouchers ||--o{ voucher_usages : "tracks"

    restaurant_categories ||--o{ restaurant_category_mappings : "mapped_to"

    users {
        uuid id PK
        varchar email UK
        varchar phone UK
        varchar password_hash
        varchar full_name
        varchar avatar_url
        enum role
        enum status
        timestamp email_verified_at
        timestamp phone_verified_at
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    restaurants {
        uuid id PK
        uuid owner_id FK
        varchar name
        text description
        varchar phone
        varchar address
        decimal latitude
        decimal longitude
        varchar logo_url
        varchar cover_image_url
        decimal average_rating
        int total_reviews
        decimal min_order_amount
        decimal delivery_fee
        int estimated_prep_time
        boolean is_open
        boolean is_featured
        enum status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    drivers {
        uuid id PK
        uuid user_id FK UK
        enum vehicle_type
        varchar vehicle_plate
        varchar license_number
        varchar license_image_url
        decimal average_rating
        int total_deliveries
        boolean is_online
        boolean is_verified
        enum status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    wallets {
        uuid id PK
        uuid user_id FK UK
        decimal balance
        varchar currency
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    carts {
        uuid id PK
        uuid user_id FK UK
        uuid restaurant_id FK
        decimal subtotal
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    orders {
        uuid id PK
        varchar order_number UK
        uuid user_id FK
        uuid restaurant_id FK
        uuid delivery_address_id FK
        enum status
        decimal subtotal
        decimal delivery_fee
        decimal discount_amount
        decimal total_amount
        uuid voucher_id FK
        enum payment_method
        text special_instructions
        timestamp estimated_delivery
        timestamp actual_delivery
        timestamp cancelled_at
        text cancellation_reason
        enum cancelled_by
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    deliveries {
        uuid id PK
        uuid order_id FK UK
        uuid driver_id FK
        enum status
        decimal pickup_latitude
        decimal pickup_longitude
        decimal dropoff_latitude
        decimal dropoff_longitude
        decimal distance_km
        int estimated_duration
        timestamp assigned_at
        timestamp picked_up_at
        timestamp delivered_at
        varchar delivery_proof_url
        text failure_reason
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    reviews {
        uuid id PK
        uuid order_id FK UK
        uuid user_id FK
        uuid restaurant_id FK
        uuid driver_id FK
        int food_rating
        int delivery_rating
        text comment
        boolean is_anonymous
        text restaurant_reply
        timestamp restaurant_replied_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    payments {
        uuid id PK
        uuid order_id FK UK
        uuid user_id FK
        decimal amount
        enum method
        enum status
        varchar transaction_id
        jsonb gateway_response
        timestamp paid_at
        decimal refund_amount
        timestamp refunded_at
        text refund_reason
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    menu_categories {
        uuid id PK
        uuid restaurant_id FK
        varchar name
        text description
        int display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    menu_items {
        uuid id PK
        uuid restaurant_id FK
        uuid category_id FK
        varchar name
        text description
        decimal price
        decimal original_price
        varchar image_url
        boolean is_available
        boolean is_featured
        int preparation_time
        int display_order
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    menu_item_options {
        uuid id PK
        uuid menu_item_id FK
        varchar option_group
        varchar name
        decimal price_modifier
        boolean is_required
        int max_selections
        boolean is_available
        boolean is_default
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    cart_items {
        uuid id PK
        uuid cart_id FK
        uuid menu_item_id FK
        int quantity
        decimal unit_price
        jsonb selected_options
        text special_instructions
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid menu_item_id FK
        varchar item_name
        int quantity
        decimal unit_price
        decimal total_price
        jsonb selected_options
        text special_instructions
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    user_addresses {
        uuid id PK
        uuid user_id FK
        varchar label
        varchar address_line
        varchar ward
        varchar district
        varchar city
        decimal latitude
        decimal longitude
        text delivery_note
        boolean is_default
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    user_devices {
        uuid id PK
        uuid user_id FK
        varchar device_token UK
        enum platform
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    user_favorites {
        uuid id PK
        uuid user_id FK
        uuid restaurant_id FK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    refresh_tokens {
        uuid id PK
        uuid user_id FK
        varchar token_hash
        varchar device_info
        varchar ip_address
        timestamp expires_at
        boolean is_revoked
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        enum type
        varchar title
        text body
        jsonb data
        boolean is_read
        timestamp read_at
        array sent_via
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    notification_templates {
        uuid id PK
        varchar name UK
        enum type
        varchar title_template
        text body_template
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    otp_verifications {
        uuid id PK
        varchar identifier
        varchar otp_hash
        enum type
        timestamp expires_at
        int attempts
        boolean is_used
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    restaurant_categories {
        uuid id PK
        varchar name UK
        varchar slug UK
        varchar icon_url
        int display_order
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    restaurant_category_mappings {
        uuid restaurant_id PK,FK
        uuid category_id PK,FK
    }

    operating_hours {
        uuid id PK
        uuid restaurant_id FK
        int day_of_week
        time open_time
        time close_time
        boolean is_closed
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    vouchers {
        uuid id PK
        varchar code UK
        varchar name
        text description
        enum discount_type
        decimal discount_value
        decimal max_discount
        decimal min_order_amount
        int usage_limit
        int usage_count
        int per_user_limit
        timestamp valid_from
        timestamp valid_until
        uuid restaurant_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    voucher_usages {
        uuid id PK
        uuid voucher_id FK
        uuid user_id FK
        uuid order_id FK
        decimal discount_applied
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    wallet_transactions {
        uuid id PK
        uuid wallet_id FK
        enum type
        decimal amount
        decimal balance_before
        decimal balance_after
        varchar reference_type
        varchar reference_id
        varchar description
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    order_status_history {
        uuid id PK
        uuid order_id FK
        enum previous_status
        enum new_status
        uuid changed_by FK
        text note
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    review_images {
        uuid id PK
        uuid review_id FK
        varchar image_url
        int display_order
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }

    driver_locations {
        uuid id PK
        uuid driver_id FK
        decimal latitude
        decimal longitude
        decimal heading
        decimal speed
        timestamp recorded_at
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
```
