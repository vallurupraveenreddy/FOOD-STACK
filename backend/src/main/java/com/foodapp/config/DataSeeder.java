package com.foodapp.config;

import com.foodapp.model.FoodItem;
import com.foodapp.model.Coupon;
import com.foodapp.model.DiscountType;
import com.foodapp.model.Role;
import com.foodapp.model.User;
import com.foodapp.repository.CouponRepository;
import com.foodapp.repository.FoodItemRepository;
import com.foodapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the database on first run so the app is usable immediately:
 *  - the same 52 menu items the React frontend already ships with
 *  - a default admin account (email: admin@foodapp.com / password: Admin@12345)
 *  - a few starter coupons for the "Today's Offers" banner
 * Safe to run every startup: it only inserts when the tables are empty.
 * Runs after SchemaFixer (@Order(1)) so the schema is already clean.
 */
@Component
@Order(2)
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedFoodItems();
        seedAdminUser();
        seedCoupons();
    }

    private void seedFoodItems() {
        if (foodItemRepository.count() > 0) {
            return;
        }
        List<FoodItem> seed = new ArrayList<>();
        seed.add(FoodItem.builder().name("Greek salad").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Salad").image("food_1.png").build());
        seed.add(FoodItem.builder().name("Veg salad").description("Food provides essential nutrients for overall health and well-being").price(18.00).category("Salad").image("food_2.png").build());
        seed.add(FoodItem.builder().name("Clover Salad").description("Food provides essential nutrients for overall health and well-being").price(16.00).category("Salad").image("food_3.png").build());
        seed.add(FoodItem.builder().name("Chicken Salad").description("Food provides essential nutrients for overall health and well-being").price(24.00).category("Salad").image("food_4.png").build());
        seed.add(FoodItem.builder().name("Lasagna Rolls").description("Food provides essential nutrients for overall health and well-being").price(14.00).category("Rolls").image("food_5.png").build());
        seed.add(FoodItem.builder().name("Peri Peri Rolls").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Rolls").image("food_6.png").build());
        seed.add(FoodItem.builder().name("Chicken Rolls").description("Food provides essential nutrients for overall health and well-being").price(20.00).category("Rolls").image("food_7.png").build());
        seed.add(FoodItem.builder().name("Veg Rolls").description("Food provides essential nutrients for overall health and well-being").price(15.00).category("Rolls").image("food_8.png").build());
        seed.add(FoodItem.builder().name("Ripple Ice Cream").description("Food provides essential nutrients for overall health and well-being").price(14.00).category("Deserts").image("food_9.png").build());
        seed.add(FoodItem.builder().name("Fruit Ice Cream").description("Food provides essential nutrients for overall health and well-being").price(22.00).category("Deserts").image("food_10.png").build());
        seed.add(FoodItem.builder().name("Jar Ice Cream").description("Food provides essential nutrients for overall health and well-being").price(10.00).category("Deserts").image("food_11.png").build());
        seed.add(FoodItem.builder().name("Vanilla Ice Cream").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Deserts").image("food_12.png").build());
        seed.add(FoodItem.builder().name("Chicken Sandwich").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Sandwich").image("food_13.png").build());
        seed.add(FoodItem.builder().name("Vegan Sandwich").description("Food provides essential nutrients for overall health and well-being").price(18.00).category("Sandwich").image("food_14.png").build());
        seed.add(FoodItem.builder().name("Grilled Sandwich").description("Food provides essential nutrients for overall health and well-being").price(16.00).category("Sandwich").image("food_15.png").build());
        seed.add(FoodItem.builder().name("Bread Sandwich").description("Food provides essential nutrients for overall health and well-being").price(24.00).category("Sandwich").image("food_16.png").build());
        seed.add(FoodItem.builder().name("Cup Cake").description("Food provides essential nutrients for overall health and well-being").price(14.00).category("Cake").image("food_17.png").build());
        seed.add(FoodItem.builder().name("Vegan Cake").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Cake").image("food_18.png").build());
        seed.add(FoodItem.builder().name("Butterscotch Cake").description("Food provides essential nutrients for overall health and well-being").price(20.00).category("Cake").image("food_19.png").build());
        seed.add(FoodItem.builder().name("Sliced Cake").description("Food provides essential nutrients for overall health and well-being").price(15.00).category("Cake").image("food_20.png").build());
        seed.add(FoodItem.builder().name("Garlic Mushroom").description("Food provides essential nutrients for overall health and well-being").price(14.00).category("Pure Veg").image("food_21.png").build());
        seed.add(FoodItem.builder().name("Fried Cauliflower").description("Food provides essential nutrients for overall health and well-being").price(22.00).category("Pure Veg").image("food_22.png").build());
        seed.add(FoodItem.builder().name("Mix Veg Pulao").description("Food provides essential nutrients for overall health and well-being").price(10.00).category("Pure Veg").image("food_23.png").build());
        seed.add(FoodItem.builder().name("Rice Zucchini").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Pure Veg").image("food_24.png").build());
        seed.add(FoodItem.builder().name("Cheese Pasta").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Pasta").image("food_25.png").build());
        seed.add(FoodItem.builder().name("Tomato Pasta").description("Food provides essential nutrients for overall health and well-being").price(18.00).category("Pasta").image("food_26.png").build());
        seed.add(FoodItem.builder().name("Creamy Pasta").description("Food provides essential nutrients for overall health and well-being").price(16.00).category("Pasta").image("food_27.png").build());
        seed.add(FoodItem.builder().name("Chicken Pasta").description("Food provides essential nutrients for overall health and well-being").price(24.00).category("Pasta").image("food_28.png").build());
        seed.add(FoodItem.builder().name("Buttter Noodles").description("Food provides essential nutrients for overall health and well-being").price(14.00).category("Noodles").image("food_29.png").build());
        seed.add(FoodItem.builder().name("Veg Noodles").description("Food provides essential nutrients for overall health and well-being").price(12.00).category("Noodles").image("food_30.png").build());
        seed.add(FoodItem.builder().name("Somen Noodles").description("Food provides essential nutrients for overall health and well-being").price(20.00).category("Noodles").image("food_31.png").build());
        seed.add(FoodItem.builder().name("Cooked Noodles").description("Food provides essential nutrients for overall health and well-being").price(15.00).category("Noodles").image("food_32.png").build());
        // ---- new menu items (added on request) ----
        seed.add(FoodItem.builder().name("Paneer Tikka Salad").description("Grilled paneer cubes tossed with crunchy greens and a tangy lemon dressing").price(16.00).category("Salad").image("food_3.png").build());
        seed.add(FoodItem.builder().name("Spring Veg Rolls").description("Crispy golden rolls packed with stir-fried vegetables and glass noodles").price(11.00).category("Rolls").image("food_6.png").build());
        seed.add(FoodItem.builder().name("Chocolate Lava Cake").description("Warm molten chocolate cake with a gooey centre, served with a dusting of cocoa").price(9.00).category("Deserts").image("food_11.png").build());
        seed.add(FoodItem.builder().name("Grilled Chicken Sandwich").description("Char-grilled chicken breast with lettuce and mayo between toasted artisan bread").price(14.00).category("Sandwich").image("food_15.png").build());
        seed.add(FoodItem.builder().name("Red Velvet Cake").description("Classic red velvet layers with smooth cream cheese frosting").price(13.00).category("Cake").image("food_19.png").build());
        seed.add(FoodItem.builder().name("Paneer Butter Masala").description("Soft paneer cubes simmered in a rich, buttery tomato gravy").price(17.00).category("Pure Veg").image("food_23.png").build());
        seed.add(FoodItem.builder().name("Creamy Alfredo Pasta").description("Fettuccine tossed in a velvety garlic-parmesan alfredo sauce").price(18.00).category("Pasta").image("food_27.png").build());
        seed.add(FoodItem.builder().name("Schezwan Noodles").description("Wok-tossed noodles in a fiery Schezwan sauce with crisp vegetables").price(16.00).category("Noodles").image("food_30.png").build());
        // ---- new menu items (round 2) ----
        seed.add(FoodItem.builder().name("Caesar Salad").description("Crisp romaine lettuce with parmesan shavings, croutons, and creamy Caesar dressing").price(14.00).category("Salad").image("food_4.png").build());
        seed.add(FoodItem.builder().name("Quinoa Veggie Bowl").description("A protein-packed salad bowl with quinoa, roasted veggies, and a lemon vinaigrette").price(15.00).category("Salad").image("food_7.png").build());
        seed.add(FoodItem.builder().name("Chicken Seekh Rolls").description("Smoky minced chicken skewers rolled in soft flatbread with mint chutney").price(13.00).category("Rolls").image("food_8.png").build());
        seed.add(FoodItem.builder().name("Paneer Kathi Rolls").description("Spiced paneer and onions wrapped in a flaky paratha roll").price(12.00).category("Rolls").image("food_9.png").build());
        seed.add(FoodItem.builder().name("New York Cheesecake").description("Rich and creamy baked cheesecake on a buttery biscuit base").price(10.00).category("Deserts").image("food_12.png").build());
        seed.add(FoodItem.builder().name("Tiramisu").description("Layers of coffee-soaked sponge and mascarpone cream, dusted with cocoa").price(11.00).category("Deserts").image("food_13.png").build());
        seed.add(FoodItem.builder().name("Club Sandwich").description("A triple-decker classic with chicken, egg, lettuce, and a smoky mayo spread").price(13.00).category("Sandwich").image("food_16.png").build());
        seed.add(FoodItem.builder().name("Chocolate Truffle Cake").description("Moist chocolate sponge layered with silky chocolate truffle cream").price(15.00).category("Cake").image("food_20.png").build());
        seed.add(FoodItem.builder().name("Dal Makhani").description("Slow-cooked black lentils simmered in a creamy, buttery gravy").price(14.00).category("Pure Veg").image("food_24.png").build());
        seed.add(FoodItem.builder().name("Veg Biryani").description("Fragrant basmati rice layered with spiced mixed vegetables and fried onions").price(16.00).category("Pure Veg").image("food_25.png").build());
        seed.add(FoodItem.builder().name("Spaghetti Arrabbiata").description("Spaghetti tossed in a spicy tomato and garlic sauce with fresh basil").price(17.00).category("Pasta").image("food_28.png").build());
        seed.add(FoodItem.builder().name("Pad Thai Noodles").description("Stir-fried rice noodles with peanuts, egg, and a sweet-tangy tamarind sauce").price(17.00).category("Noodles").image("food_31.png").build());
        foodItemRepository.saveAll(seed);
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmail("admin@foodapp.com")) {
            return;
        }
        User admin = User.builder()
                .name("Admin")
                .email("admin@foodapp.com")
                .password(passwordEncoder.encode("Admin@12345"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
    }

    private void seedCoupons() {
        if (couponRepository.count() > 0) {
            return;
        }
        couponRepository.save(Coupon.builder()
                .code("WELCOME50").description("50% OFF, max $10 off")
                .discountType(DiscountType.PERCENT).value(50.0).maxDiscount(10.0).minOrderAmount(0.0)
                .active(true).build());
        couponRepository.save(Coupon.builder()
                .code("FIRSTORDER").description("$5 off your order")
                .discountType(DiscountType.FLAT).value(5.0).minOrderAmount(20.0)
                .active(true).build());
        couponRepository.save(Coupon.builder()
                .code("FOOD20").description("20% OFF, max $15 off")
                .discountType(DiscountType.PERCENT).value(20.0).maxDiscount(15.0).minOrderAmount(0.0)
                .active(true).build());
    }
}
