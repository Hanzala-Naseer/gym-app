// import 'package:flutter/material.dart';
// import 'dart:async';
// import 'dart:convert' as convert;
// import 'package:http/http.dart' as http;
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// import 'package:geolocator/geolocator.dart';
// import 'package:geocoding/geocoding.dart';
// import 'package:webview_flutter/webview_flutter.dart';
// import 'package:flutter_map/flutter_map.dart' as fm;
// import 'package:latlong2/latlong.dart' as latlng;
// import 'dart:io' show Platform;
// import 'package:flutter/foundation.dart' show kIsWeb;
// import 'package:mobile_scanner/mobile_scanner.dart';

// // ===========================================================================
// // DESIGN SYSTEM — "Warm Luxury Athleticism"
// // ===========================================================================

// class AppColors {
//   // Primary / Chocolate Truffle
//   static const Color primary = Color(0xFF0D0300);
//   static const Color onPrimary = Color(0xFFFFFFFF);
//   static const Color primaryContainer = Color(0xFF2C1A0E);
//   static const Color onPrimaryContainer = Color(0xFF9D806F);

//   // Secondary / Caramel (CTAs, active states)
//   static const Color secondary = Color(0xFF885210);
//   static const Color onSecondary = Color(0xFFFFFFFF);
//   static const Color secondaryContainer = Color(0xFFFDB56C);
//   static const Color onSecondaryContainer = Color(0xFF774401);

//   // Tertiary
//   static const Color tertiary = Color(0xFF0E0300);
//   static const Color onTertiary = Color(0xFFFFFFFF);
//   static const Color tertiaryContainer = Color(0xFF351600);

//   // Surface / Cream
//   static const Color surface = Color(0xFFFFF8F0);
//   static const Color surfaceDim = Color(0xFFE0D9D0);
//   static const Color surfaceBright = Color(0xFFFFF8F0);
//   static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
//   static const Color surfaceContainerLow = Color(0xFFFAF3E9);
//   static const Color surfaceContainer = Color(0xFFF4EDE3);
//   static const Color surfaceContainerHigh = Color(0xFFEEE7DD);
//   static const Color surfaceContainerHighest = Color(0xFFE8E2D8);
//   static const Color onSurface = Color(0xFF1E1B16);
//   static const Color onSurfaceVariant = Color(0xFF4F453F);

//   // Outline
//   static const Color outline = Color(0xFF81756E);
//   static const Color outlineVariant = Color(0xFFD3C4BC);

//   // Inverse
//   static const Color inverseSurface = Color(0xFF33302A);
//   static const Color inverseOnSurface = Color(0xFFF7F0E6);

//   // Error
//   static const Color error = Color(0xFFBA1A1A);
//   static const Color errorContainer = Color(0xFFFFDAD6);
//   static const Color onErrorContainer = Color(0xFF93000A);

//   // Background
//   static const Color background = Color(0xFFFFF8F0);
//   static const Color onBackground = Color(0xFF1E1B16);
// }

// class AppTextStyles {
//   static const String fontFamily = 'Inter';

//   static const TextStyle headlineXL = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 32,
//     fontWeight: FontWeight.w700,
//     letterSpacing: -0.6,
//     height: 1.2,
//     color: AppColors.primary,
//   );

//   static const TextStyle headlineLG = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 24,
//     fontWeight: FontWeight.w600,
//     letterSpacing: -0.24,
//     height: 1.25,
//     color: AppColors.primary,
//   );

//   static const TextStyle headlineMD = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 20,
//     fontWeight: FontWeight.w600,
//     height: 1.4,
//     color: AppColors.primary,
//   );

//   static const TextStyle bodyLG = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 18,
//     fontWeight: FontWeight.w400,
//     height: 1.55,
//     color: AppColors.onSurface,
//   );

//   static const TextStyle bodyMD = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 16,
//     fontWeight: FontWeight.w400,
//     height: 1.5,
//     color: AppColors.onSurface,
//   );

//   static const TextStyle labelMD = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 14,
//     fontWeight: FontWeight.w500,
//     letterSpacing: 0.14,
//     height: 1.43,
//     color: AppColors.onSurface,
//   );

//   static const TextStyle labelSM = TextStyle(
//     fontFamily: fontFamily,
//     fontSize: 12,
//     fontWeight: FontWeight.w600,
//     letterSpacing: 0.36,
//     height: 1.33,
//     color: AppColors.onSurfaceVariant,
//   );
// }

// // Warm ambient shadow
// BoxDecoration get luxuryCardDecoration => BoxDecoration(
//   color: AppColors.surfaceContainerLowest,
//   borderRadius: BorderRadius.circular(16),
//   border: Border.all(color: AppColors.surfaceContainer, width: 1),
//   boxShadow: const [
//     BoxShadow(color: Color(0x142C1A0E), blurRadius: 30, offset: Offset(0, 8)),
//   ],
// );

// // ===========================================================================
// // 1. CONFIGURATION & CONSTANTS
// // ===========================================================================

// class AppConfig {
//   static const String baseUrl = 'http://192.168.1.15:5001/api';
//   static const String imageBaseUrl = 'http://192.168.1.15:5001/api/images';
// }

// class AppRoutes {
//   static const String splash = '/';
//   static const String auth = '/auth';
//   static const String register = '/register';
//   static const String forgotPassword = '/forgot-password';
//   static const String home = '/home';
//   static const String gymDetails = '/gym-details';
//   static const String subscription = '/subscription';
//   static const String notifications = '/notifications';
//   static const String checkInHistory = '/check-in-history';
//   static const String aiOnboarding = '/ai-onboarding';
//   static const String aiWorkout = '/ai-workout';
//   static const String nutrition = '/nutrition';
//   static const String payment = '/payment';
// }

// // ===========================================================================
// // 2. MODELS
// // ===========================================================================

// class User {
//   final String id;
//   final String name;
//   final String email;
//   final String? phone;
//   final String? membershipTier;
//   final DateTime? createdAt;

//   User({
//     required this.id,
//     required this.name,
//     required this.email,
//     this.phone,
//     this.membershipTier,
//     this.createdAt,
//   });

//   factory User.fromJson(Map<String, dynamic> json) {
//     String? currentTierName;
//     final activeSub = json['activeSubscription'];
//     if (activeSub != null && activeSub['tier'] != null) {
//       currentTierName = activeSub['tier']['name']?.toString();
//     }
//     DateTime? createdAt;
//     if (json['createdAt'] != null) {
//       try {
//         createdAt = DateTime.parse(json['createdAt']);
//       } catch (_) {}
//     }
//     return User(
//       id: json['id']?.toString() ?? '',
//       name: json['name'] ?? '',
//       email: json['email'] ?? '',
//       phone: json['phone'],
//       membershipTier: currentTierName,
//       createdAt: createdAt,
//     );
//   }

//   String get formattedCreatedAt {
//     if (createdAt == null) return "N/A";
//     return "${createdAt!.day.toString().padLeft(2, '0')}-"
//         "${createdAt!.month.toString().padLeft(2, '0')}-"
//         "${createdAt!.year}";
//   }
// }

// class Gym {
//   final String id;
//   final String name;
//   final String address;
//   final double latitude;
//   final double longitude;
//   final double distance;
//   final String planType;
//   final String imageUrl;
//   final List<String> facilities;
//   final Map<String, String> hours;

//   Gym({
//     required this.id,
//     required this.name,
//     required this.address,
//     this.latitude = 0.0,
//     this.longitude = 0.0,
//     required this.distance,
//     required this.planType,
//     required this.imageUrl,
//     this.facilities = const [],
//     this.hours = const {},
//   });

//   factory Gym.fromJson(Map<String, dynamic> json) {
//     String getPlanType(dynamic tier) {
//       final tierInt = int.tryParse(tier?.toString() ?? '0') ?? 0;
//       if (tierInt == 2) return 'Premium';
//       if (tierInt >= 1) return 'Standard';
//       return 'Standard';
//     }

//     String getFullImageUrl(String? path) {
//       if (path == null || path.trim().isEmpty) {
//         return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80';
//       }
//       final cleaned = path.replaceAll(RegExp(r'\s+'), '');
//       if (cleaned.startsWith('http')) return cleaned;
//       final normalized = cleaned.startsWith('/')
//           ? cleaned.substring(1)
//           : cleaned;
//       final fullUrl = normalized.startsWith('uploads/')
//           ? '${AppConfig.imageBaseUrl}/$normalized'
//           : '${AppConfig.imageBaseUrl}/uploads/$normalized';
//       return fullUrl;
//     }

//     List<String> parseFacilities(dynamic data) {
//       if (data == null) return [];
//       if (data is List) return List<String>.from(data.whereType<String>());
//       try {
//         final List<dynamic> list = convert.json.decode(data.toString());
//         return list.map((e) => e.toString()).toList();
//       } catch (_) {
//         return [];
//       }
//     }

//     return Gym(
//       id: json['id'].toString(),
//       name: json['name'] ?? '',
//       address: "${json['addressLine'] ?? ''}, ${json['city'] ?? ''}",
//       imageUrl: getFullImageUrl(json['coverImageUrl']),
//       latitude: (json['latitude'] is num) ? json['latitude'].toDouble() : 0.0,
//       longitude: (json['longitude'] is num)
//           ? json['longitude'].toDouble()
//           : 0.0,
//       distance: (json['distance'] is num) ? json['distance'].toDouble() : 0.0,
//       planType: getPlanType(json['tier']),
//       facilities: parseFacilities(json['facilities']),
//       hours: Map<String, String>.from(
//         json['hours'] ?? {'Mon-Fri': '6AM - 10PM'},
//       ),
//     );
//   }
// }

// class SubscriptionPlan {
//   final String id;
//   final String name;
//   final int price;
//   final String interval;
//   final int accessTier;
//   final String description;
//   final List<String> features;

//   SubscriptionPlan({
//     required this.id,
//     required this.name,
//     required this.price,
//     required this.interval,
//     required this.accessTier,
//     required this.description,
//     required this.features,
//   });

//   factory SubscriptionPlan.fromJson(Map<String, dynamic> json) {
//     return SubscriptionPlan(
//       id: json['id'] ?? '',
//       name: json['name'] ?? '',
//       price: json['price'] ?? 0,
//       interval: json['interval'] ?? 'month',
//       accessTier: json['accessTier'] ?? 1,
//       description: json['description'] ?? '',
//       features: List<String>.from(json['features'] ?? []),
//     );
//   }
// }

// // ===========================================================================
// // 3. AUTH & STATE MANAGEMENT
// // ===========================================================================

// class AuthManager {
//   static final AuthManager _instance = AuthManager._internal();
//   factory AuthManager() => _instance;
//   AuthManager._internal();

//   String? _authToken;
//   User? _currentUser;
//   final _storage = const FlutterSecureStorage();
//   Position? _currentLocation;
//   String _currentAddress = "Fetching location...";

//   final ValueNotifier<bool> locationStatusNotifier = ValueNotifier(false);
//   final ValueNotifier<bool> authStatusNotifier = ValueNotifier(false);

//   bool get isAuthenticated => _authToken != null;
//   User? get user => _currentUser;
//   String? get token => _authToken;
//   Position? get currentLocation => _currentLocation;
//   String get currentAddress => _currentAddress;

//   void setCurrentUser(User user) => _currentUser = user;

//   void setSession(String token, User user) {
//     _authToken = token;
//     _currentUser = user;
//     _storage.write(key: 'jwt_token', value: token);
//     authStatusNotifier.value = true;
//   }

//   Future<bool> loadSession() async {
//     final storedToken = await _storage.read(key: 'jwt_token');
//     if (storedToken != null) {
//       try {
//         final profile = await ApiService().getProfile(storedToken);
//         final user = User.fromJson(profile);
//         setSession(storedToken, user);
//         return true;
//       } catch (e) {
//         logout();
//         return false;
//       }
//     }
//     return false;
//   }

//   void logout() {
//     _authToken = null;
//     _currentUser = null;
//     _storage.delete(key: 'jwt_token');
//     authStatusNotifier.value = false;
//   }

//   Future<void> fetchLocation() async {
//     locationStatusNotifier.value = false;
//     try {
//       LocationPermission permission = await Geolocator.checkPermission();
//       if (permission == LocationPermission.denied) {
//         permission = await Geolocator.requestPermission();
//         if (permission == LocationPermission.denied ||
//             permission == LocationPermission.deniedForever) {
//           _currentAddress = "Location permissions denied.";
//           throw Exception("Location permissions denied.");
//         }
//       }
//       final position = await Geolocator.getCurrentPosition(
//         desiredAccuracy: LocationAccuracy.medium,
//         timeLimit: const Duration(seconds: 10),
//       );
//       _currentLocation = position;
//       if (kIsWeb) {
//         try {
//           final url =
//               'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.latitude}&lon=${position.longitude}';
//           final response = await http.get(
//             Uri.parse(url),
//             headers: {'User-Agent': 'GymKey Flutter App'},
//           );
//           if (response.statusCode == 200) {
//             final data = convert.jsonDecode(response.body);
//             _currentAddress =
//                 data['display_name'] ??
//                 "Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
//           }
//         } catch (e) {
//           _currentAddress =
//               "Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
//         }
//       } else {
//         try {
//           final placemarks = await placemarkFromCoordinates(
//             position.latitude,
//             position.longitude,
//           );
//           if (placemarks.isNotEmpty) {
//             final p = placemarks.first;
//             _currentAddress = [
//               p.street,
//               p.locality,
//               p.administrativeArea,
//               p.country,
//             ].where((s) => s != null && s.isNotEmpty).join(', ');
//           }
//         } catch (e) {
//           _currentAddress =
//               "Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
//         }
//       }
//     } catch (e) {
//       _currentLocation = null;
//       _currentAddress = "Location unavailable.";
//     } finally {
//       locationStatusNotifier.value = true;
//     }
//   }
// }

// // ===========================================================================
// // 4. API SERVICE
// // ===========================================================================

// class ApiService {
//   const ApiService();

//   Map<String, String> _defaultHeader() => {"Content-Type": "application/json"};

//   Map<String, String> _authHeader() {
//     final token = AuthManager().token;
//     if (token == null)
//       throw const FormatException(
//         "AUTH_TOKEN_MISSING: Authentication token is missing.",
//       );
//     return {
//       "Authorization": "Bearer $token",
//       "Content-Type": "application/json",
//     };
//   }

//   dynamic _handleResponse(http.Response response) {
//     if (response.statusCode >= 200 && response.statusCode < 300) {
//       if (response.body.isEmpty) return {};
//       try {
//         return convert.json.decode(response.body);
//       } catch (e) {
//         throw Exception("Server returned invalid JSON format.");
//       }
//     } else {
//       final body = response.body.isNotEmpty
//           ? convert.json.decode(response.body)
//           : {};
//       final error =
//           body["message"] ??
//           body["error"] ??
//           "Request failed with status ${response.statusCode}.";
//       throw Exception(error);
//     }
//   }

//   Future<bool> checkInGym({
//     required String gymId,
//     required String qrToken,
//   }) async {
//     final response = await http.post(
//       Uri.parse('${AppConfig.baseUrl}/checkin'),
//       headers: _authHeader(),
//       body: convert.json.encode({'gymId': gymId, 'qrToken': qrToken}),
//     );
//     final responseBody = _handleResponse(response);
//     if (responseBody is Map<String, dynamic>)
//       return responseBody['success'] == true;
//     return true;
//   }

//   Future<Map<String, dynamic>> login(String email, String password) async {
//     final response = await http.post(
//       Uri.parse('${AppConfig.baseUrl}/auth/login'),
//       headers: _defaultHeader(),
//       body: convert.json.encode({'email': email, 'password': password}),
//     );
//     return _handleResponse(response);
//   }

//   Future<Map<String, dynamic>> register(
//     String name,
//     String email,
//     String password,
//   ) async {
//     final response = await http.post(
//       Uri.parse('${AppConfig.baseUrl}/auth/signup'),
//       headers: _defaultHeader(),
//       body: convert.json.encode({
//         'name': name,
//         'email': email,
//         'password': password,
//       }),
//     );
//     return _handleResponse(response);
//   }

//   Future<Map<String, dynamic>> verifyOTP(String email, String otp) async {
//     final response = await http.post(
//       Uri.parse('${AppConfig.baseUrl}/auth/verify-otp'),
//       headers: _defaultHeader(),
//       body: convert.json.encode({'email': email, 'otp': otp}),
//     );
//     return _handleResponse(response);
//   }

//   Future<Map<String, dynamic>> getProfile(String token) async {
//     final response = await http.get(
//       Uri.parse('${AppConfig.baseUrl}/members/profile'),
//       headers: {"Authorization": "Bearer $token"},
//     );
//     return _handleResponse(response);
//   }

//   Future<List<Gym>> getGyms() async {
//     final headers = _authHeader();
//     final location = AuthManager().currentLocation;
//     final Map<String, dynamic> queryParams = {};
//     if (location != null) {
//       queryParams['latitude'] = location.latitude.toString();
//       queryParams['longitude'] = location.longitude.toString();
//     }
//     final uri = Uri.parse(
//       '${AppConfig.baseUrl}/gyms',
//     ).replace(queryParameters: queryParams);
//     final response = await http.get(uri, headers: headers);
//     final dynamic responseBody = _handleResponse(response);
//     if (responseBody is List) {
//       return responseBody.map((json) => Gym.fromJson(json)).toList();
//     }
//     if (responseBody is Map<String, dynamic> &&
//         responseBody.containsKey('gyms') &&
//         responseBody['gyms'] is List) {
//       final List<dynamic> jsonList = responseBody['gyms'] as List<dynamic>;
//       return jsonList.map((json) => Gym.fromJson(json)).toList();
//     }
//     throw Exception("Invalid gym list format from server.");
//   }

//   Future<List<SubscriptionPlan>> getPlans() async {
//     final response = await http.get(
//       Uri.parse('${AppConfig.baseUrl}/subscription/plans'),
//     );
//     if (response.statusCode != 200) throw Exception("Failed to load plans");
//     final decoded = convert.jsonDecode(response.body);
//     final List<dynamic> jsonList = decoded is List ? decoded : decoded['plans'];
//     jsonList.sort((a, b) => (a['price'] ?? 0).compareTo(b['price'] ?? 0));
//     return jsonList.map((json) => SubscriptionPlan.fromJson(json)).toList();
//   }
// }

// // ===========================================================================
// // 5. MAIN & APP ENTRY
// // ===========================================================================

// void main() async {
//   WidgetsFlutterBinding.ensureInitialized();
//   await AuthManager().loadSession();
//   await AuthManager().fetchLocation();
//   runApp(const GymKeyApp());
// }

// class GymKeyApp extends StatelessWidget {
//   const GymKeyApp({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       title: 'GymKey',
//       debugShowCheckedModeBanner: false,
//       theme: ThemeData(
//         useMaterial3: true,
//         fontFamily: 'Inter',
//         scaffoldBackgroundColor: AppColors.background,
//         colorScheme: const ColorScheme(
//           brightness: Brightness.light,
//           primary: AppColors.primary,
//           onPrimary: AppColors.onPrimary,
//           primaryContainer: AppColors.primaryContainer,
//           onPrimaryContainer: AppColors.onPrimaryContainer,
//           secondary: AppColors.secondary,
//           onSecondary: AppColors.onSecondary,
//           secondaryContainer: AppColors.secondaryContainer,
//           onSecondaryContainer: AppColors.onSecondaryContainer,
//           tertiary: AppColors.tertiary,
//           onTertiary: AppColors.onTertiary,
//           tertiaryContainer: AppColors.tertiaryContainer,
//           onTertiaryContainer: AppColors.onPrimaryContainer,
//           error: AppColors.error,
//           onError: Colors.white,
//           errorContainer: AppColors.errorContainer,
//           onErrorContainer: AppColors.onErrorContainer,
//           surface: AppColors.surface,
//           onSurface: AppColors.onSurface,
//           surfaceContainerHighest: AppColors.surfaceContainerHighest,
//           outline: AppColors.outline,
//           outlineVariant: AppColors.outlineVariant,
//           inverseSurface: AppColors.inverseSurface,
//           onInverseSurface: AppColors.inverseOnSurface,
//           inversePrimary: Color(0xFFE1C0AD),
//         ),
//         appBarTheme: const AppBarTheme(
//           backgroundColor: AppColors.primaryContainer,
//           foregroundColor: AppColors.onPrimary,
//           surfaceTintColor: Colors.transparent,
//           elevation: 0,
//           centerTitle: true,
//           iconTheme: IconThemeData(color: AppColors.onPrimary),
//           titleTextStyle: TextStyle(
//             fontFamily: 'Inter',
//             color: AppColors.onPrimary,
//             fontSize: 20,
//             fontWeight: FontWeight.w600,
//             letterSpacing: -0.3,
//           ),
//         ),
//         bottomNavigationBarTheme: const BottomNavigationBarThemeData(
//           backgroundColor: AppColors.surfaceContainerLowest,
//           selectedItemColor: AppColors.secondary,
//           unselectedItemColor: AppColors.outline,
//           type: BottomNavigationBarType.fixed,
//           elevation: 0,
//           selectedLabelStyle: TextStyle(
//             fontFamily: 'Inter',
//             fontSize: 12,
//             fontWeight: FontWeight.w600,
//           ),
//           unselectedLabelStyle: TextStyle(fontFamily: 'Inter', fontSize: 12),
//         ),
//         elevatedButtonTheme: ElevatedButtonThemeData(
//           style: ElevatedButton.styleFrom(
//             backgroundColor: AppColors.primaryContainer,
//             foregroundColor: AppColors.onPrimary,
//             elevation: 0,
//             shape: const StadiumBorder(),
//             textStyle: const TextStyle(
//               fontFamily: 'Inter',
//               fontWeight: FontWeight.w600,
//               fontSize: 15,
//             ),
//           ),
//         ),
//         inputDecorationTheme: InputDecorationTheme(
//           filled: true,
//           fillColor: AppColors.surfaceContainerLow,
//           border: OutlineInputBorder(
//             borderRadius: BorderRadius.circular(12),
//             borderSide: BorderSide.none,
//           ),
//           focusedBorder: OutlineInputBorder(
//             borderRadius: BorderRadius.circular(12),
//             borderSide: const BorderSide(
//               color: AppColors.secondary,
//               width: 1.5,
//             ),
//           ),
//           hintStyle: const TextStyle(
//             color: AppColors.outline,
//             fontFamily: 'Inter',
//           ),
//           labelStyle: const TextStyle(
//             color: AppColors.onSurfaceVariant,
//             fontFamily: 'Inter',
//           ),
//           contentPadding: const EdgeInsets.symmetric(
//             horizontal: 16,
//             vertical: 14,
//           ),
//         ),
//         cardTheme: CardThemeData(
//           color: AppColors.surfaceContainerLowest,
//           elevation: 0,
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(16),
//             side: const BorderSide(color: AppColors.surfaceContainer),
//           ),
//           margin: EdgeInsets.zero,
//         ),
//       ),
//       initialRoute: AppRoutes.splash,
//       routes: {
//         AppRoutes.splash: (context) => const SplashScreen(),
//         AppRoutes.auth: (context) => const LoginScreen(),
//         AppRoutes.register: (context) => const RegisterScreen(),
//         AppRoutes.forgotPassword: (context) => const ForgotPasswordScreen(),
//         AppRoutes.home: (context) => const MainNavScreen(),
//         AppRoutes.subscription: (context) => const SubscriptionScreen(),
//         AppRoutes.notifications: (context) => const NotificationsScreen(),
//         AppRoutes.checkInHistory: (context) => const CheckInHistoryScreen(),
//         AppRoutes.aiOnboarding: (context) => const AIFitnessOnboardingScreen(),
//         AppRoutes.aiWorkout: (context) => const AIWorkoutScreen(),
//         AppRoutes.nutrition: (context) => const NutritionScreen(),
//       },
//       onGenerateRoute: (settings) {
//         if (settings.name == AppRoutes.gymDetails) {
//           final gym = settings.arguments as Gym;
//           return MaterialPageRoute(
//             builder: (context) => GymDetailScreen(gym: gym),
//           );
//         }
//         if (settings.name == AppRoutes.payment) {
//           final plan = settings.arguments as SubscriptionPlan;
//           return MaterialPageRoute(
//             builder: (context) => PaymentScreen(plan: plan),
//           );
//         }
//         return null;
//       },
//     );
//   }
// }

// // ===========================================================================
// // 6. REUSABLE WIDGETS
// // ===========================================================================

// // Luxury App Bar used on most screens
// class GymKeyAppBar extends StatelessWidget implements PreferredSizeWidget {
//   final String? title;
//   final bool showBack;
//   final bool showMenu;
//   final List<Widget>? actions;

//   const GymKeyAppBar({
//     super.key,
//     this.title,
//     this.showBack = false,
//     this.showMenu = false,
//     this.actions,
//   });

//   @override
//   Size get preferredSize => const Size.fromHeight(64);

//   @override
//   Widget build(BuildContext context) {
//     final user = AuthManager().user;
//     final initials = user?.name.isNotEmpty == true
//         ? user!.name[0].toUpperCase()
//         : 'G';

//     return AppBar(
//       backgroundColor: AppColors.primaryContainer,
//       elevation: 0,
//       automaticallyImplyLeading: false,
//       leading: showBack
//           ? IconButton(
//               icon: const Icon(Icons.arrow_back, color: AppColors.onPrimary),
//               onPressed: () => Navigator.pop(context),
//             )
//           : showMenu
//           ? IconButton(
//               icon: const Icon(Icons.menu, color: AppColors.onPrimary),
//               onPressed: () {},
//             )
//           : null,
//       title: Text(
//         title ?? 'GymKey',
//         style: const TextStyle(
//           fontFamily: 'Inter',
//           color: AppColors.onPrimary,
//           fontSize: 20,
//           fontWeight: FontWeight.w600,
//           letterSpacing: -0.3,
//         ),
//       ),
//       centerTitle: true,
//       actions:
//           actions ??
//           [
//             Padding(
//               padding: const EdgeInsets.only(right: 16),
//               child: GestureDetector(
//                 onTap: () =>
//                     Navigator.pushNamed(context, AppRoutes.notifications),
//                 child: CircleAvatar(
//                   radius: 18,
//                   backgroundColor: AppColors.onPrimaryContainer.withOpacity(
//                     0.3,
//                   ),
//                   child: Text(
//                     initials,
//                     style: const TextStyle(
//                       color: AppColors.onPrimary,
//                       fontWeight: FontWeight.w600,
//                       fontSize: 14,
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ],
//     );
//   }
// }

// class LuxuryGymCard extends StatelessWidget {
//   final Gym gym;
//   final bool compact;

//   const LuxuryGymCard({required this.gym, this.compact = false, super.key});

//   @override
//   Widget build(BuildContext context) {
//     final isPremium = gym.planType.toLowerCase() == 'premium';
//     return GestureDetector(
//       onTap: () =>
//           Navigator.pushNamed(context, AppRoutes.gymDetails, arguments: gym),
//       child: Container(
//         decoration: luxuryCardDecoration,
//         clipBehavior: Clip.antiAlias,
//         child: compact ? _buildCompact(isPremium) : _buildFull(isPremium),
//       ),
//     );
//   }

//   Widget _buildFull(bool isPremium) {
//     return Row(
//       children: [
//         ClipRRect(
//           borderRadius: const BorderRadius.only(
//             topLeft: Radius.circular(16),
//             bottomLeft: Radius.circular(16),
//           ),
//           child: Image.network(
//             gym.imageUrl,
//             width: 88,
//             height: 88,
//             fit: BoxFit.cover,
//             errorBuilder: (_, __, ___) => Container(
//               width: 88,
//               height: 88,
//               color: AppColors.surfaceContainerHigh,
//               child: const Icon(Icons.fitness_center, color: AppColors.outline),
//             ),
//           ),
//         ),
//         Expanded(
//           child: Padding(
//             padding: const EdgeInsets.all(14),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Row(
//                   children: [
//                     Expanded(
//                       child: Text(
//                         gym.name,
//                         style: AppTextStyles.labelMD.copyWith(
//                           color: AppColors.primary,
//                           fontWeight: FontWeight.w600,
//                         ),
//                         maxLines: 1,
//                         overflow: TextOverflow.ellipsis,
//                       ),
//                     ),
//                     Container(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 8,
//                         vertical: 3,
//                       ),
//                       decoration: BoxDecoration(
//                         color: isPremium
//                             ? AppColors.secondary
//                             : AppColors.surfaceContainerHigh,
//                         borderRadius: BorderRadius.circular(99),
//                       ),
//                       child: Text(
//                         gym.planType.toUpperCase(),
//                         style: AppTextStyles.labelSM.copyWith(
//                           color: isPremium
//                               ? AppColors.onSecondary
//                               : AppColors.onSurfaceVariant,
//                           fontSize: 10,
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 4),
//                 Row(
//                   children: [
//                     const Icon(
//                       Icons.location_on_outlined,
//                       size: 14,
//                       color: AppColors.outline,
//                     ),
//                     const SizedBox(width: 3),
//                     Expanded(
//                       child: Text(
//                         gym.address,
//                         style: AppTextStyles.labelSM.copyWith(
//                           fontSize: 12,
//                           fontWeight: FontWeight.w400,
//                         ),
//                         maxLines: 1,
//                         overflow: TextOverflow.ellipsis,
//                       ),
//                     ),
//                   ],
//                 ),
//                 const SizedBox(height: 6),
//                 Row(
//                   children: [
//                     const Icon(
//                       Icons.near_me,
//                       size: 13,
//                       color: AppColors.secondary,
//                     ),
//                     const SizedBox(width: 4),
//                     Text(
//                       '${gym.distance.toStringAsFixed(1)} km away',
//                       style: AppTextStyles.labelSM.copyWith(
//                         color: AppColors.secondary,
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                   ],
//                 ),
//               ],
//             ),
//           ),
//         ),
//         const Padding(
//           padding: EdgeInsets.only(right: 12),
//           child: Icon(Icons.chevron_right, color: AppColors.outline),
//         ),
//       ],
//     );
//   }

//   Widget _buildCompact(bool isPremium) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Stack(
//           children: [
//             Image.network(
//               gym.imageUrl,
//               height: 140,
//               width: double.infinity,
//               fit: BoxFit.cover,
//               errorBuilder: (_, __, ___) => Container(
//                 height: 140,
//                 color: AppColors.surfaceContainerHigh,
//                 child: const Center(
//                   child: Icon(Icons.fitness_center, color: AppColors.outline),
//                 ),
//               ),
//             ),
//             Positioned(
//               top: 10,
//               left: 10,
//               child: Container(
//                 padding: const EdgeInsets.symmetric(
//                   horizontal: 10,
//                   vertical: 4,
//                 ),
//                 decoration: BoxDecoration(
//                   color: isPremium
//                       ? AppColors.secondary
//                       : AppColors.primaryContainer,
//                   borderRadius: BorderRadius.circular(99),
//                 ),
//                 child: Text(
//                   gym.planType.toUpperCase(),
//                   style: const TextStyle(
//                     color: Colors.white,
//                     fontSize: 10,
//                     fontWeight: FontWeight.w700,
//                     fontFamily: 'Inter',
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//         Padding(
//           padding: const EdgeInsets.all(14),
//           child: Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Text(
//                 gym.name,
//                 style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
//               ),
//               const SizedBox(height: 4),
//               Row(
//                 children: [
//                   const Icon(
//                     Icons.location_on_outlined,
//                     size: 14,
//                     color: AppColors.outline,
//                   ),
//                   const SizedBox(width: 4),
//                   Expanded(
//                     child: Text(
//                       gym.address,
//                       style: AppTextStyles.labelSM.copyWith(
//                         fontWeight: FontWeight.w400,
//                       ),
//                       overflow: TextOverflow.ellipsis,
//                     ),
//                   ),
//                   Text(
//                     '${gym.distance.toStringAsFixed(1)} km',
//                     style: AppTextStyles.labelSM.copyWith(
//                       color: AppColors.secondary,
//                       fontWeight: FontWeight.w700,
//                     ),
//                   ),
//                 ],
//               ),
//             ],
//           ),
//         ),
//       ],
//     );
//   }
// }

// // Plan tier colors
// Color _planTierColor(int tier) {
//   switch (tier) {
//     case 1:
//       return const Color(0xFF5B8CDB);
//     case 2:
//       return AppColors.secondary;
//     case 3:
//       return const Color(0xFFB8862A);
//     default:
//       return AppColors.outline;
//   }
// }

// // ===========================================================================
// // 7. SPLASH SCREEN
// // ===========================================================================

// class SplashScreen extends StatefulWidget {
//   const SplashScreen({super.key});

//   @override
//   State<SplashScreen> createState() => _SplashScreenState();
// }

// class _SplashScreenState extends State<SplashScreen>
//     with SingleTickerProviderStateMixin {
//   late AnimationController _ctrl;
//   late Animation<double> _fade;

//   @override
//   void initState() {
//     super.initState();
//     _ctrl = AnimationController(
//       vsync: this,
//       duration: const Duration(milliseconds: 800),
//     );
//     _fade = CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);
//     _ctrl.forward();
//     Future.delayed(const Duration(milliseconds: 1600), _navigate);
//   }

//   void _navigate() {
//     if (mounted) {
//       Navigator.pushReplacementNamed(
//         context,
//         AuthManager().isAuthenticated ? AppRoutes.home : AppRoutes.auth,
//       );
//     }
//   }

//   @override
//   void dispose() {
//     _ctrl.dispose();
//     super.dispose();
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.primaryContainer,
//       body: Center(
//         child: FadeTransition(
//           opacity: _fade,
//           child: Column(
//             mainAxisSize: MainAxisSize.min,
//             children: [
//               Container(
//                 width: 80,
//                 height: 80,
//                 decoration: BoxDecoration(
//                   color: AppColors.secondary.withOpacity(0.25),
//                   borderRadius: BorderRadius.circular(24),
//                 ),
//                 child: const Icon(
//                   Icons.fitness_center,
//                   size: 44,
//                   color: AppColors.onPrimary,
//                 ),
//               ),
//               const SizedBox(height: 20),
//               const Text(
//                 'GymKey',
//                 style: TextStyle(
//                   fontFamily: 'Inter',
//                   color: AppColors.onPrimary,
//                   fontSize: 36,
//                   fontWeight: FontWeight.w700,
//                   letterSpacing: -1,
//                 ),
//               ),
//               const SizedBox(height: 6),
//               Text(
//                 'MEMBERS ONLY ACCESS',
//                 style: AppTextStyles.labelSM.copyWith(
//                   color: AppColors.onPrimary.withOpacity(0.6),
//                   letterSpacing: 2,
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 8. AUTH SCREENS — LOGIN, REGISTER, FORGOT PASSWORD, OTP
// // ===========================================================================

// class LoginScreen extends StatefulWidget {
//   const LoginScreen({super.key});

//   @override
//   State<LoginScreen> createState() => _LoginScreenState();
// }

// class _LoginScreenState extends State<LoginScreen> {
//   bool isLoading = false;
//   bool _obscurePass = true;
//   final _emailCtrl = TextEditingController(text: 'hanzala@example.com');
//   final _passCtrl = TextEditingController(text: 'password123');
//   final ApiService _api = const ApiService();

//   Future<void> _login() async {
//     setState(() => isLoading = true);
//     try {
//       final response = await _api.login(_emailCtrl.text.trim(), _passCtrl.text);
//       final token = response['token'];
//       final user = User.fromJson(response['user'] ?? {});
//       AuthManager().setSession(token, user);
//       if (response['requiresVerification'] == true) {
//         Navigator.pushReplacement(
//           context,
//           MaterialPageRoute(
//             builder: (_) => OTPScreen(email: _emailCtrl.text.trim()),
//           ),
//         );
//       } else {
//         Navigator.pushReplacementNamed(context, AppRoutes.home);
//       }
//     } catch (e) {
//       _showError(e.toString().replaceAll('Exception: ', ''));
//     } finally {
//       setState(() => isLoading = false);
//     }
//   }

//   void _showError(String msg) {
//     ScaffoldMessenger.of(context).showSnackBar(
//       SnackBar(
//         content: Text(msg),
//         backgroundColor: AppColors.error,
//         behavior: SnackBarBehavior.floating,
//         shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
//       ),
//     );
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       body: Column(
//         children: [
//           // Hero Header
//           Container(
//             height: MediaQuery.of(context).size.height * 0.35,
//             width: double.infinity,
//             decoration: const BoxDecoration(
//               color: AppColors.primaryContainer,
//               image: DecorationImage(
//                 image: NetworkImage(
//                   'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
//                 ),
//                 fit: BoxFit.cover,
//                 colorFilter: ColorFilter.mode(
//                   Color(0xCC2C1A0E),
//                   BlendMode.multiply,
//                 ),
//               ),
//             ),
//             child: SafeArea(
//               child: Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: [
//                   const Text(
//                     'GymKey',
//                     style: TextStyle(
//                       fontFamily: 'Inter',
//                       color: Colors.white,
//                       fontSize: 40,
//                       fontWeight: FontWeight.w700,
//                       letterSpacing: -1.5,
//                     ),
//                   ),
//                   const SizedBox(height: 6),
//                   Text(
//                     'MEMBERS ONLY ACCESS',
//                     style: AppTextStyles.labelSM.copyWith(
//                       color: Colors.white60,
//                       letterSpacing: 2.5,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),

//           // Form Card
//           Expanded(
//             child: SingleChildScrollView(
//               child: Padding(
//                 padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
//                 child: Transform.translate(
//                   offset: const Offset(0, -32),
//                   child: Container(
//                     decoration: luxuryCardDecoration,
//                     padding: const EdgeInsets.all(24),
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Text('Welcome Back', style: AppTextStyles.headlineLG),
//                         const SizedBox(height: 4),
//                         Text(
//                           'Sign in to resume your discipline.',
//                           style: AppTextStyles.bodyMD.copyWith(
//                             color: AppColors.onSurfaceVariant,
//                           ),
//                         ),
//                         const SizedBox(height: 24),

//                         // Email
//                         Text(
//                           'Email Address',
//                           style: AppTextStyles.labelMD.copyWith(
//                             color: AppColors.onSurfaceVariant,
//                           ),
//                         ),
//                         const SizedBox(height: 8),
//                         TextField(
//                           controller: _emailCtrl,
//                           keyboardType: TextInputType.emailAddress,
//                           decoration: const InputDecoration(
//                             hintText: 'name@example.com',
//                             prefixIcon: Icon(
//                               Icons.mail_outline,
//                               color: AppColors.outline,
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 16),

//                         // Password
//                         Row(
//                           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                           children: [
//                             Text(
//                               'Password',
//                               style: AppTextStyles.labelMD.copyWith(
//                                 color: AppColors.onSurfaceVariant,
//                               ),
//                             ),
//                             GestureDetector(
//                               onTap: () => Navigator.pushNamed(
//                                 context,
//                                 AppRoutes.forgotPassword,
//                               ),
//                               child: Text(
//                                 'Forgot Password?',
//                                 style: AppTextStyles.labelMD.copyWith(
//                                   color: AppColors.secondary,
//                                 ),
//                               ),
//                             ),
//                           ],
//                         ),
//                         const SizedBox(height: 8),
//                         TextField(
//                           controller: _passCtrl,
//                           obscureText: _obscurePass,
//                           decoration: InputDecoration(
//                             hintText: '••••••••',
//                             prefixIcon: const Icon(
//                               Icons.lock_outline,
//                               color: AppColors.outline,
//                             ),
//                             suffixIcon: IconButton(
//                               icon: Icon(
//                                 _obscurePass
//                                     ? Icons.visibility_off_outlined
//                                     : Icons.visibility_outlined,
//                                 color: AppColors.outline,
//                               ),
//                               onPressed: () =>
//                                   setState(() => _obscurePass = !_obscurePass),
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 28),

//                         // Login Button
//                         SizedBox(
//                           width: double.infinity,
//                           height: 54,
//                           child: ElevatedButton(
//                             onPressed: isLoading ? null : _login,
//                             style: ElevatedButton.styleFrom(
//                               backgroundColor: AppColors.primaryContainer,
//                               foregroundColor: AppColors.onPrimary,
//                               elevation: 0,
//                               shape: const StadiumBorder(),
//                             ),
//                             child: isLoading
//                                 ? const SizedBox(
//                                     width: 22,
//                                     height: 22,
//                                     child: CircularProgressIndicator(
//                                       color: Colors.white,
//                                       strokeWidth: 2.5,
//                                     ),
//                                   )
//                                 : const Text(
//                                     'Sign In',
//                                     style: TextStyle(
//                                       fontFamily: 'Inter',
//                                       fontWeight: FontWeight.w600,
//                                       fontSize: 16,
//                                     ),
//                                   ),
//                           ),
//                         ),

//                         const SizedBox(height: 20),
//                         Row(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Text(
//                               "Don't have an account? ",
//                               style: AppTextStyles.bodyMD.copyWith(
//                                 color: AppColors.onSurfaceVariant,
//                               ),
//                             ),
//                             GestureDetector(
//                               onTap: () => Navigator.pushNamed(
//                                 context,
//                                 AppRoutes.register,
//                               ),
//                               child: Text(
//                                 'Join Now',
//                                 style: AppTextStyles.bodyMD.copyWith(
//                                   color: AppColors.secondary,
//                                   fontWeight: FontWeight.w600,
//                                 ),
//                               ),
//                             ),
//                           ],
//                         ),
//                       ],
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// // --- REGISTER SCREEN ---
// class RegisterScreen extends StatefulWidget {
//   const RegisterScreen({super.key});

//   @override
//   State<RegisterScreen> createState() => _RegisterScreenState();
// }

// class _RegisterScreenState extends State<RegisterScreen> {
//   bool isLoading = false;
//   bool _obscurePass = true;
//   final _nameCtrl = TextEditingController();
//   final _emailCtrl = TextEditingController();
//   final _passCtrl = TextEditingController();
//   final ApiService _api = const ApiService();

//   Future<void> _register() async {
//     setState(() => isLoading = true);
//     try {
//       await _api.register(
//         _nameCtrl.text.trim(),
//         _emailCtrl.text.trim(),
//         _passCtrl.text,
//       );
//       Navigator.pushReplacement(
//         context,
//         MaterialPageRoute(
//           builder: (_) => OTPScreen(email: _emailCtrl.text.trim()),
//         ),
//       );
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//           content: Text(e.toString().replaceAll('Exception: ', '')),
//           backgroundColor: AppColors.error,
//           behavior: SnackBarBehavior.floating,
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(12),
//           ),
//         ),
//       );
//     } finally {
//       setState(() => isLoading = false);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       body: Column(
//         children: [
//           Container(
//             height: MediaQuery.of(context).size.height * 0.28,
//             width: double.infinity,
//             decoration: const BoxDecoration(
//               color: AppColors.primaryContainer,
//               image: DecorationImage(
//                 image: NetworkImage(
//                   'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
//                 ),
//                 fit: BoxFit.cover,
//                 colorFilter: ColorFilter.mode(
//                   Color(0xDD2C1A0E),
//                   BlendMode.multiply,
//                 ),
//               ),
//             ),
//             child: SafeArea(
//               child: Column(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: [
//                   const Text(
//                     'GymKey',
//                     style: TextStyle(
//                       fontFamily: 'Inter',
//                       color: Colors.white,
//                       fontSize: 36,
//                       fontWeight: FontWeight.w700,
//                       letterSpacing: -1,
//                     ),
//                   ),
//                   const SizedBox(height: 4),
//                   Text(
//                     'JOIN THE ELITE MOVEMENT',
//                     style: AppTextStyles.labelSM.copyWith(
//                       color: Colors.white60,
//                       letterSpacing: 2,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           Expanded(
//             child: SingleChildScrollView(
//               padding: const EdgeInsets.fromLTRB(24, 0, 24, 40),
//               child: Transform.translate(
//                 offset: const Offset(0, -28),
//                 child: Container(
//                   decoration: luxuryCardDecoration,
//                   padding: const EdgeInsets.all(24),
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Text('Create Account', style: AppTextStyles.headlineLG),
//                       const SizedBox(height: 4),
//                       Text(
//                         'Start your journey to discipline.',
//                         style: AppTextStyles.bodyMD.copyWith(
//                           color: AppColors.onSurfaceVariant,
//                         ),
//                       ),
//                       const SizedBox(height: 24),

//                       _inputField('Full Name', Icons.person_outline, _nameCtrl),
//                       const SizedBox(height: 14),
//                       _inputField(
//                         'Email Address',
//                         Icons.mail_outline,
//                         _emailCtrl,
//                         keyboardType: TextInputType.emailAddress,
//                       ),
//                       const SizedBox(height: 14),
//                       TextField(
//                         controller: _passCtrl,
//                         obscureText: _obscurePass,
//                         decoration: InputDecoration(
//                           hintText: 'Password',
//                           prefixIcon: const Icon(
//                             Icons.lock_outline,
//                             color: AppColors.outline,
//                           ),
//                           suffixIcon: IconButton(
//                             icon: Icon(
//                               _obscurePass
//                                   ? Icons.visibility_off_outlined
//                                   : Icons.visibility_outlined,
//                               color: AppColors.outline,
//                             ),
//                             onPressed: () =>
//                                 setState(() => _obscurePass = !_obscurePass),
//                           ),
//                         ),
//                       ),
//                       const SizedBox(height: 28),
//                       SizedBox(
//                         width: double.infinity,
//                         height: 54,
//                         child: ElevatedButton(
//                           onPressed: isLoading ? null : _register,
//                           style: ElevatedButton.styleFrom(
//                             backgroundColor: AppColors.primaryContainer,
//                             foregroundColor: AppColors.onPrimary,
//                             shape: const StadiumBorder(),
//                           ),
//                           child: isLoading
//                               ? const SizedBox(
//                                   width: 22,
//                                   height: 22,
//                                   child: CircularProgressIndicator(
//                                     color: Colors.white,
//                                     strokeWidth: 2.5,
//                                   ),
//                                 )
//                               : const Text(
//                                   'Create Account',
//                                   style: TextStyle(
//                                     fontFamily: 'Inter',
//                                     fontWeight: FontWeight.w600,
//                                     fontSize: 16,
//                                   ),
//                                 ),
//                         ),
//                       ),
//                       const SizedBox(height: 20),
//                       Row(
//                         mainAxisAlignment: MainAxisAlignment.center,
//                         children: [
//                           Text(
//                             'Already a member? ',
//                             style: AppTextStyles.bodyMD.copyWith(
//                               color: AppColors.onSurfaceVariant,
//                             ),
//                           ),
//                           GestureDetector(
//                             onTap: () => Navigator.pop(context),
//                             child: Text(
//                               'Sign In',
//                               style: AppTextStyles.bodyMD.copyWith(
//                                 color: AppColors.secondary,
//                                 fontWeight: FontWeight.w600,
//                               ),
//                             ),
//                           ),
//                         ],
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _inputField(
//     String hint,
//     IconData icon,
//     TextEditingController ctrl, {
//     TextInputType keyboardType = TextInputType.text,
//   }) {
//     return TextField(
//       controller: ctrl,
//       keyboardType: keyboardType,
//       decoration: InputDecoration(
//         hintText: hint,
//         prefixIcon: Icon(icon, color: AppColors.outline),
//       ),
//     );
//   }
// }

// // --- FORGOT PASSWORD SCREEN ---
// class ForgotPasswordScreen extends StatefulWidget {
//   const ForgotPasswordScreen({super.key});

//   @override
//   State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
// }

// class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
//   final _emailCtrl = TextEditingController();
//   bool _otpSent = false;
//   bool isLoading = false;

//   void _sendOtp() {
//     // TODO: wire to backend reset endpoint
//     setState(() {
//       _otpSent = true;
//       isLoading = false;
//     });
//     ScaffoldMessenger.of(
//       context,
//     ).showSnackBar(const SnackBar(content: Text('OTP sent to your email')));
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(title: 'GymKey', showBack: true, actions: []),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(24),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             const SizedBox(height: 8),
//             // Step indicator
//             Row(
//               children: [
//                 _stepBadge('1', 'Identity', active: true),
//                 Container(
//                   height: 2,
//                   width: 40,
//                   color: AppColors.outlineVariant,
//                   margin: const EdgeInsets.symmetric(
//                     horizontal: 8,
//                     vertical: 0,
//                   ),
//                 ),
//                 _stepBadge('2', 'Security', active: false),
//               ],
//             ),
//             const SizedBox(height: 32),
//             Text('Reset Password', style: AppTextStyles.headlineXL),
//             const SizedBox(height: 8),
//             Text(
//               'Enter your registered email to receive a secure verification code.',
//               style: AppTextStyles.bodyMD.copyWith(
//                 color: AppColors.onSurfaceVariant,
//               ),
//             ),
//             const SizedBox(height: 28),
//             Text(
//               'Email Address',
//               style: AppTextStyles.labelMD.copyWith(
//                 color: AppColors.onSurfaceVariant,
//               ),
//             ),
//             const SizedBox(height: 8),
//             TextField(
//               controller: _emailCtrl,
//               keyboardType: TextInputType.emailAddress,
//               decoration: const InputDecoration(
//                 hintText: 'name@example.com',
//                 suffixIcon: Icon(
//                   Icons.mail_outline,
//                   color: AppColors.secondary,
//                 ),
//               ),
//             ),
//             const SizedBox(height: 20),
//             if (_otpSent) ...[
//               Container(
//                 padding: const EdgeInsets.all(16),
//                 decoration: luxuryCardDecoration,
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                       children: [
//                         Text(
//                           'Verification Code',
//                           style: AppTextStyles.labelMD.copyWith(
//                             color: AppColors.onSurfaceVariant,
//                           ),
//                         ),
//                         GestureDetector(
//                           onTap: _sendOtp,
//                           child: Text(
//                             'Resend OTP',
//                             style: AppTextStyles.labelMD.copyWith(
//                               color: AppColors.secondary,
//                             ),
//                           ),
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 12),
//                     TextField(
//                       keyboardType: TextInputType.number,
//                       maxLength: 6,
//                       textAlign: TextAlign.center,
//                       decoration: const InputDecoration(
//                         hintText: '6-digit code',
//                         counterText: '',
//                       ),
//                     ),
//                     const SizedBox(height: 12),
//                     SizedBox(
//                       width: double.infinity,
//                       height: 50,
//                       child: ElevatedButton(
//                         onPressed: () => Navigator.pop(context),
//                         style: ElevatedButton.styleFrom(
//                           backgroundColor: AppColors.primaryContainer,
//                           foregroundColor: AppColors.onPrimary,
//                           shape: const StadiumBorder(),
//                         ),
//                         child: const Text(
//                           'Reset Password',
//                           style: TextStyle(
//                             fontFamily: 'Inter',
//                             fontWeight: FontWeight.w600,
//                           ),
//                         ),
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ] else ...[
//               SizedBox(
//                 width: double.infinity,
//                 height: 54,
//                 child: ElevatedButton(
//                   onPressed: _sendOtp,
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primaryContainer,
//                     foregroundColor: AppColors.onPrimary,
//                     shape: const StadiumBorder(),
//                   ),
//                   child: const Text(
//                     'Send Verification Code',
//                     style: TextStyle(
//                       fontFamily: 'Inter',
//                       fontWeight: FontWeight.w600,
//                       fontSize: 16,
//                     ),
//                   ),
//                 ),
//               ),
//             ],
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _stepBadge(String num, String label, {required bool active}) {
//     return Column(
//       children: [
//         CircleAvatar(
//           radius: 20,
//           backgroundColor: active
//               ? AppColors.secondary
//               : AppColors.surfaceContainerHigh,
//           child: Text(
//             num,
//             style: TextStyle(
//               color: active
//                   ? AppColors.onSecondary
//                   : AppColors.onSurfaceVariant,
//               fontWeight: FontWeight.w600,
//               fontFamily: 'Inter',
//             ),
//           ),
//         ),
//         const SizedBox(height: 4),
//         Text(
//           label,
//           style: AppTextStyles.labelSM.copyWith(
//             color: active ? AppColors.secondary : AppColors.onSurfaceVariant,
//           ),
//         ),
//       ],
//     );
//   }
// }

// // --- OTP SCREEN ---
// class OTPScreen extends StatefulWidget {
//   final String email;
//   const OTPScreen({required this.email, super.key});

//   @override
//   State<OTPScreen> createState() => _OTPScreenState();
// }

// class _OTPScreenState extends State<OTPScreen> {
//   final List<TextEditingController> _otpCtrls = List.generate(
//     6,
//     (_) => TextEditingController(),
//   );
//   bool isLoading = false;
//   final ApiService _api = const ApiService();

//   String get _fullOtp => _otpCtrls.map((c) => c.text).join();

//   Future<void> _verify() async {
//     if (_fullOtp.length < 6) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         const SnackBar(content: Text('Please enter the complete 6-digit code')),
//       );
//       return;
//     }
//     setState(() => isLoading = true);
//     try {
//       final response = await _api.verifyOTP(widget.email, _fullOtp);
//       final token = response['token'];
//       final user = User.fromJson(response['user'] ?? {});
//       AuthManager().setSession(token, user);
//       Navigator.pushNamedAndRemoveUntil(
//         context,
//         AppRoutes.home,
//         (route) => false,
//       );
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//           content: Text(e.toString().replaceAll('Exception: ', '')),
//           backgroundColor: AppColors.error,
//           behavior: SnackBarBehavior.floating,
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(12),
//           ),
//         ),
//       );
//     } finally {
//       setState(() => isLoading = false);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(title: 'GymKey', showBack: true, actions: []),
//       body: SingleChildScrollView(
//         child: Padding(
//           padding: const EdgeInsets.all(24),
//           child: Column(
//             children: [
//               const SizedBox(height: 20),
//               Container(
//                 width: 72,
//                 height: 72,
//                 decoration: BoxDecoration(
//                   color: AppColors.surfaceContainerLow,
//                   borderRadius: BorderRadius.circular(36),
//                 ),
//                 child: const Icon(
//                   Icons.mail_outline,
//                   size: 36,
//                   color: AppColors.secondary,
//                 ),
//               ),
//               const SizedBox(height: 24),
//               Text(
//                 'Verify your account',
//                 style: AppTextStyles.headlineLG,
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 8),
//               Text(
//                 'Enter the 6-digit code we sent to\n${widget.email}',
//                 textAlign: TextAlign.center,
//                 style: AppTextStyles.bodyMD.copyWith(
//                   color: AppColors.onSurfaceVariant,
//                 ),
//               ),
//               const SizedBox(height: 32),
//               // OTP input row
//               Row(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: List.generate(6, (i) {
//                   return Container(
//                     width: 46,
//                     height: 56,
//                     margin: const EdgeInsets.symmetric(horizontal: 4),
//                     child: TextField(
//                       controller: _otpCtrls[i],
//                       maxLength: 1,
//                       textAlign: TextAlign.center,
//                       keyboardType: TextInputType.number,
//                       decoration: InputDecoration(
//                         counterText: '',
//                         filled: true,
//                         fillColor: AppColors.surfaceContainerLow,
//                         border: OutlineInputBorder(
//                           borderRadius: BorderRadius.circular(10),
//                           borderSide: BorderSide.none,
//                         ),
//                         focusedBorder: OutlineInputBorder(
//                           borderRadius: BorderRadius.circular(10),
//                           borderSide: const BorderSide(
//                             color: AppColors.secondary,
//                             width: 1.5,
//                           ),
//                         ),
//                         contentPadding: EdgeInsets.zero,
//                       ),
//                       style: AppTextStyles.headlineMD.copyWith(fontSize: 22),
//                       onChanged: (v) {
//                         if (v.isNotEmpty && i < 5) {
//                           FocusScope.of(context).nextFocus();
//                         }
//                       },
//                     ),
//                   );
//                 }),
//               ),
//               const SizedBox(height: 32),
//               SizedBox(
//                 width: double.infinity,
//                 height: 54,
//                 child: ElevatedButton(
//                   onPressed: isLoading ? null : _verify,
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primaryContainer,
//                     foregroundColor: AppColors.onPrimary,
//                     shape: const StadiumBorder(),
//                   ),
//                   child: isLoading
//                       ? const SizedBox(
//                           width: 22,
//                           height: 22,
//                           child: CircularProgressIndicator(
//                             color: Colors.white,
//                             strokeWidth: 2.5,
//                           ),
//                         )
//                       : const Text(
//                           'Verify Identity',
//                           style: TextStyle(
//                             fontFamily: 'Inter',
//                             fontWeight: FontWeight.w600,
//                             fontSize: 16,
//                           ),
//                         ),
//                 ),
//               ),
//               const SizedBox(height: 20),
//               Row(
//                 mainAxisAlignment: MainAxisAlignment.center,
//                 children: [
//                   Text(
//                     "Didn't receive the code? ",
//                     style: AppTextStyles.bodyMD.copyWith(
//                       color: AppColors.onSurfaceVariant,
//                     ),
//                   ),
//                   GestureDetector(
//                     onTap: () {}, // TODO: resend OTP
//                     child: Text(
//                       'Resend Code',
//                       style: AppTextStyles.bodyMD.copyWith(
//                         color: AppColors.secondary,
//                         fontWeight: FontWeight.w600,
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 9. MAIN NAV (Bottom Nav Shell)
// // ===========================================================================

// class MainNavScreen extends StatefulWidget {
//   const MainNavScreen({super.key});

//   @override
//   State<MainNavScreen> createState() => _MainNavScreenState();
// }

// class _MainNavScreenState extends State<MainNavScreen> {
//   int _currentIndex = 0;
//   final List<Widget> _screens = const [
//     HomeScreen(),
//     CheckInScreen(),
//     FindGymScreen(),
//     ProfileScreen(),
//   ];

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: IndexedStack(index: _currentIndex, children: _screens),
//       bottomNavigationBar: Container(
//         decoration: const BoxDecoration(
//           color: AppColors.surfaceContainerLowest,
//           border: Border(
//             top: BorderSide(color: AppColors.outlineVariant, width: 0.5),
//           ),
//         ),
//         child: BottomNavigationBar(
//           currentIndex: _currentIndex,
//           onTap: (i) => setState(() => _currentIndex = i),
//           backgroundColor: Colors.transparent,
//           elevation: 0,
//           type: BottomNavigationBarType.fixed,
//           selectedItemColor: AppColors.secondary,
//           unselectedItemColor: AppColors.outline,
//           selectedLabelStyle: const TextStyle(
//             fontFamily: 'Inter',
//             fontSize: 11,
//             fontWeight: FontWeight.w600,
//           ),
//           unselectedLabelStyle: const TextStyle(
//             fontFamily: 'Inter',
//             fontSize: 11,
//           ),
//           items: const [
//             BottomNavigationBarItem(
//               icon: Icon(Icons.home_outlined),
//               activeIcon: Icon(Icons.home),
//               label: 'Home',
//             ),
//             BottomNavigationBarItem(
//               icon: Icon(Icons.qr_code_scanner_outlined),
//               activeIcon: Icon(Icons.qr_code_scanner),
//               label: 'Check In',
//             ),
//             BottomNavigationBarItem(
//               icon: Icon(Icons.explore_outlined),
//               activeIcon: Icon(Icons.explore),
//               label: 'Explore',
//             ),
//             BottomNavigationBarItem(
//               icon: Icon(Icons.person_outline),
//               activeIcon: Icon(Icons.person),
//               label: 'Profile',
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 10. HOME SCREEN
// // ===========================================================================

// class HomeScreen extends StatelessWidget {
//   const HomeScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return ValueListenableBuilder<bool>(
//       valueListenable: AuthManager().authStatusNotifier,
//       builder: (context, _, __) {
//         final user = AuthManager().user;
//         final hasActivePlan = user?.membershipTier != null;

//         return Scaffold(
//           backgroundColor: AppColors.background,
//           appBar: PreferredSize(
//             preferredSize: const Size.fromHeight(64),
//             child: AppBar(
//               backgroundColor: AppColors.primaryContainer,
//               automaticallyImplyLeading: false,
//               title: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 mainAxisSize: MainAxisSize.min,
//                 children: [
//                   Text(
//                     'Welcome back,',
//                     style: AppTextStyles.labelMD.copyWith(
//                       color: AppColors.onPrimary.withOpacity(0.7),
//                     ),
//                   ),
//                   Text(
//                     user?.name ?? 'Guest',
//                     style: const TextStyle(
//                       fontFamily: 'Inter',
//                       color: AppColors.onPrimary,
//                       fontSize: 18,
//                       fontWeight: FontWeight.w700,
//                     ),
//                   ),
//                 ],
//               ),
//               actions: [
//                 IconButton(
//                   icon: const Icon(
//                     Icons.notifications_outlined,
//                     color: AppColors.onPrimary,
//                   ),
//                   onPressed: () =>
//                       Navigator.pushNamed(context, AppRoutes.notifications),
//                 ),
//                 const SizedBox(width: 8),
//               ],
//             ),
//           ),
//           body: RefreshIndicator(
//             color: AppColors.secondary,
//             onRefresh: () async {
//               await AuthManager().fetchLocation();
//               AuthManager().authStatusNotifier.value =
//                   !AuthManager().authStatusNotifier.value;
//             },
//             child: SingleChildScrollView(
//               padding: const EdgeInsets.all(20),
//               physics: const AlwaysScrollableScrollPhysics(),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   // Hero Card
//                   Container(
//                     width: double.infinity,
//                     padding: const EdgeInsets.all(24),
//                     decoration: BoxDecoration(
//                       gradient: const LinearGradient(
//                         begin: Alignment.topLeft,
//                         end: Alignment.bottomRight,
//                         colors: [
//                           AppColors.primaryContainer,
//                           Color(0xFF3D2616),
//                           AppColors.primaryContainer,
//                         ],
//                       ),
//                       borderRadius: BorderRadius.circular(20),
//                       boxShadow: const [
//                         BoxShadow(
//                           color: Color(0x302C1A0E),
//                           blurRadius: 24,
//                           offset: Offset(0, 8),
//                         ),
//                       ],
//                     ),
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Container(
//                           padding: const EdgeInsets.symmetric(
//                             horizontal: 10,
//                             vertical: 5,
//                           ),
//                           decoration: BoxDecoration(
//                             color: AppColors.secondary.withOpacity(0.25),
//                             borderRadius: BorderRadius.circular(99),
//                           ),
//                           child: Text(
//                             hasActivePlan
//                                 ? '${user!.membershipTier?.toUpperCase()} MEMBER'
//                                 : 'GUEST ACCESS',
//                             style: const TextStyle(
//                               fontFamily: 'Inter',
//                               color: AppColors.secondaryContainer,
//                               fontSize: 11,
//                               fontWeight: FontWeight.w700,
//                               letterSpacing: 1.5,
//                             ),
//                           ),
//                         ),
//                         const SizedBox(height: 12),
//                         const Text(
//                           'Elevate Your\nTraining',
//                           style: TextStyle(
//                             fontFamily: 'Inter',
//                             color: Colors.white,
//                             fontSize: 26,
//                             fontWeight: FontWeight.w700,
//                             height: 1.2,
//                           ),
//                         ),
//                         const SizedBox(height: 8),
//                         Text(
//                           'Access 50+ boutique studios with one single key.',
//                           style: TextStyle(
//                             fontFamily: 'Inter',
//                             color: Colors.white.withOpacity(0.75),
//                             fontSize: 14,
//                             height: 1.4,
//                           ),
//                         ),
//                         const SizedBox(height: 20),
//                         GestureDetector(
//                           onTap: () => Navigator.pushNamed(
//                             context,
//                             AppRoutes.subscription,
//                           ),
//                           child: Container(
//                             padding: const EdgeInsets.symmetric(
//                               horizontal: 20,
//                               vertical: 12,
//                             ),
//                             decoration: BoxDecoration(
//                               color: AppColors.secondary,
//                               borderRadius: BorderRadius.circular(99),
//                               boxShadow: [
//                                 BoxShadow(
//                                   color: AppColors.secondary.withOpacity(0.4),
//                                   blurRadius: 12,
//                                   offset: const Offset(0, 4),
//                                 ),
//                               ],
//                             ),
//                             child: Text(
//                               hasActivePlan ? 'Manage Plan' : 'Upgrade Plan',
//                               style: const TextStyle(
//                                 fontFamily: 'Inter',
//                                 color: Colors.white,
//                                 fontWeight: FontWeight.w600,
//                                 fontSize: 14,
//                               ),
//                             ),
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),

//                   const SizedBox(height: 24),

//                   // Quick Stats Grid
//                   Row(
//                     children: [
//                       Expanded(
//                         child: _statCard(
//                           Icons.bolt,
//                           'Active Streak',
//                           '12 Days',
//                           AppColors.secondary,
//                         ),
//                       ),
//                       const SizedBox(width: 12),
//                       Expanded(
//                         child: _statCard(
//                           Icons.calendar_today_outlined,
//                           'Next Class',
//                           'Tomorrow, 7AM',
//                           AppColors.primary,
//                         ),
//                       ),
//                     ],
//                   ),

//                   const SizedBox(height: 24),

//                   // Membership status
//                   Container(
//                     padding: const EdgeInsets.all(16),
//                     decoration: BoxDecoration(
//                       color: hasActivePlan
//                           ? const Color(0xFFF0FDF4)
//                           : const Color(0xFFFFF7ED),
//                       borderRadius: BorderRadius.circular(14),
//                       border: Border.all(
//                         color: hasActivePlan
//                             ? const Color(0xFF4ADE80)
//                             : const Color(0xFFFBBF24),
//                       ),
//                     ),
//                     child: Row(
//                       children: [
//                         Icon(
//                           hasActivePlan
//                               ? Icons.verified_rounded
//                               : Icons.warning_amber_rounded,
//                           color: hasActivePlan
//                               ? const Color(0xFF16A34A)
//                               : const Color(0xFFD97706),
//                         ),
//                         const SizedBox(width: 12),
//                         Expanded(
//                           child: Text(
//                             hasActivePlan
//                                 ? 'Active Plan: ${user!.membershipTier}'
//                                 : 'No Active Plan – Tap to Upgrade',
//                             style: AppTextStyles.labelMD.copyWith(
//                               color: hasActivePlan
//                                   ? const Color(0xFF16A34A)
//                                   : const Color(0xFFD97706),
//                               fontWeight: FontWeight.w600,
//                             ),
//                           ),
//                         ),
//                         if (!hasActivePlan)
//                           GestureDetector(
//                             onTap: () => Navigator.pushNamed(
//                               context,
//                               AppRoutes.subscription,
//                             ),
//                             child: Container(
//                               padding: const EdgeInsets.symmetric(
//                                 horizontal: 12,
//                                 vertical: 6,
//                               ),
//                               decoration: BoxDecoration(
//                                 color: const Color(0xFFD97706),
//                                 borderRadius: BorderRadius.circular(99),
//                               ),
//                               child: const Text(
//                                 'Upgrade',
//                                 style: TextStyle(
//                                   fontFamily: 'Inter',
//                                   color: Colors.white,
//                                   fontWeight: FontWeight.w600,
//                                   fontSize: 12,
//                                 ),
//                               ),
//                             ),
//                           ),
//                       ],
//                     ),
//                   ),

//                   if (!hasActivePlan) ...[
//                     const SizedBox(height: 24),
//                     Text('Popular Plans', style: AppTextStyles.headlineMD),
//                     const SizedBox(height: 12),
//                     _PlansSection(),
//                   ],

//                   const SizedBox(height: 24),

//                   // AI Feature Cards
//                   Row(
//                     children: [
//                       Expanded(
//                         child: _featureCard(
//                           context,
//                           icon: Icons.auto_awesome,
//                           title: 'AI Workout',
//                           subtitle: 'Personalized plan',
//                           color: AppColors.secondary,
//                           route: AppRoutes.aiWorkout,
//                         ),
//                       ),
//                       const SizedBox(width: 12),
//                       Expanded(
//                         child: _featureCard(
//                           context,
//                           icon: Icons.restaurant_menu_outlined,
//                           title: 'Nutrition',
//                           subtitle: 'Track calories',
//                           color: AppColors.primary,
//                           route: AppRoutes.nutrition,
//                         ),
//                       ),
//                     ],
//                   ),

//                   const SizedBox(height: 24),

//                   // Nearby Gyms
//                   Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                     children: [
//                       Text('Nearby Studios', style: AppTextStyles.headlineMD),
//                       GestureDetector(
//                         onTap: () {},
//                         child: Text(
//                           'See All',
//                           style: AppTextStyles.labelMD.copyWith(
//                             color: AppColors.secondary,
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 12),
//                   _GymsNearYou(),
//                 ],
//               ),
//             ),
//           ),
//         );
//       },
//     );
//   }

//   Widget _statCard(IconData icon, String label, String value, Color color) {
//     return Container(
//       padding: const EdgeInsets.all(16),
//       decoration: BoxDecoration(
//         color: AppColors.surfaceContainerLow,
//         borderRadius: BorderRadius.circular(14),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Icon(icon, color: color, size: 22),
//           const SizedBox(height: 8),
//           Text(
//             label,
//             style: AppTextStyles.labelSM.copyWith(
//               color: AppColors.onSurfaceVariant,
//             ),
//           ),
//           const SizedBox(height: 2),
//           Text(value, style: AppTextStyles.headlineMD.copyWith(fontSize: 17)),
//         ],
//       ),
//     );
//   }

//   Widget _featureCard(
//     BuildContext context, {
//     required IconData icon,
//     required String title,
//     required String subtitle,
//     required Color color,
//     required String route,
//   }) {
//     return GestureDetector(
//       onTap: () => Navigator.pushNamed(context, route),
//       child: Container(
//         padding: const EdgeInsets.all(16),
//         decoration: BoxDecoration(
//           color: color.withOpacity(0.08),
//           borderRadius: BorderRadius.circular(14),
//           border: Border.all(color: color.withOpacity(0.2)),
//         ),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Icon(icon, color: color, size: 26),
//             const SizedBox(height: 10),
//             Text(
//               title,
//               style: AppTextStyles.labelMD.copyWith(
//                 color: color,
//                 fontWeight: FontWeight.w700,
//               ),
//             ),
//             const SizedBox(height: 2),
//             Text(
//               subtitle,
//               style: AppTextStyles.labelSM.copyWith(
//                 fontWeight: FontWeight.w400,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _PlansSection extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return FutureBuilder<List<SubscriptionPlan>>(
//       future: const ApiService().getPlans(),
//       builder: (context, snapshot) {
//         if (snapshot.connectionState == ConnectionState.waiting) {
//           return const SizedBox(
//             height: 120,
//             child: Center(
//               child: CircularProgressIndicator(color: AppColors.secondary),
//             ),
//           );
//         }
//         if (snapshot.hasError || !snapshot.hasData || snapshot.data!.isEmpty) {
//           return const SizedBox();
//         }
//         final plans = snapshot.data!
//             .where((p) => p.interval.toLowerCase().startsWith('month'))
//             .toList();
//         return SizedBox(
//           height: 160,
//           child: ListView.separated(
//             scrollDirection: Axis.horizontal,
//             itemCount: plans.length,
//             separatorBuilder: (_, __) => const SizedBox(width: 12),
//             itemBuilder: (context, i) {
//               final plan = plans[i];
//               final color = _planTierColor(plan.accessTier);
//               return GestureDetector(
//                 onTap: () =>
//                     Navigator.pushNamed(context, AppRoutes.subscription),
//                 child: Container(
//                   width: 156,
//                   padding: const EdgeInsets.all(16),
//                   decoration: BoxDecoration(
//                     color: color.withOpacity(0.07),
//                     borderRadius: BorderRadius.circular(14),
//                     border: Border.all(color: color.withOpacity(0.35)),
//                   ),
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Text(
//                         plan.name,
//                         style: AppTextStyles.labelMD.copyWith(
//                           color: color,
//                           fontWeight: FontWeight.w700,
//                         ),
//                       ),
//                       const SizedBox(height: 4),
//                       Expanded(
//                         child: Text(
//                           plan.description.isNotEmpty
//                               ? plan.description
//                               : plan.features.take(2).join(', '),
//                           style: AppTextStyles.labelSM.copyWith(
//                             fontWeight: FontWeight.w400,
//                             height: 1.4,
//                           ),
//                           maxLines: 3,
//                           overflow: TextOverflow.ellipsis,
//                         ),
//                       ),
//                       const SizedBox(height: 8),
//                       Text(
//                         'Rs. ${plan.price} / mo',
//                         style: AppTextStyles.labelMD.copyWith(
//                           color: color,
//                           fontWeight: FontWeight.w800,
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               );
//             },
//           ),
//         );
//       },
//     );
//   }
// }

// class _GymsNearYou extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     return FutureBuilder<List<Gym>>(
//       future: const ApiService().getGyms(),
//       builder: (context, snapshot) {
//         if (snapshot.connectionState == ConnectionState.waiting) {
//           return const Center(
//             child: Padding(
//               padding: EdgeInsets.all(24),
//               child: CircularProgressIndicator(color: AppColors.secondary),
//             ),
//           );
//         }
//         if (snapshot.hasError) {
//           return Center(
//             child: Padding(
//               padding: const EdgeInsets.all(16),
//               child: Text(
//                 'Could not load gyms.',
//                 style: AppTextStyles.bodyMD.copyWith(color: AppColors.error),
//               ),
//             ),
//           );
//         }
//         if (!snapshot.hasData || snapshot.data!.isEmpty) {
//           return Center(
//             child: Text(
//               'No gyms found nearby.',
//               style: AppTextStyles.bodyMD.copyWith(
//                 color: AppColors.onSurfaceVariant,
//               ),
//             ),
//           );
//         }
//         final gyms = snapshot.data!.take(3).toList();
//         return Column(
//           children: gyms
//               .map(
//                 (gym) => Padding(
//                   padding: const EdgeInsets.only(bottom: 12),
//                   child: LuxuryGymCard(gym: gym),
//                 ),
//               )
//               .toList(),
//         );
//       },
//     );
//   }
// }

// // ===========================================================================
// // 11. CHECK IN SCREEN
// // ===========================================================================

// class CheckInScreen extends StatefulWidget {
//   const CheckInScreen({super.key});

//   @override
//   State<CheckInScreen> createState() => _CheckInScreenState();
// }

// class _CheckInScreenState extends State<CheckInScreen> {
//   late Future<List<Gym>> _futureGyms;

//   @override
//   void initState() {
//     super.initState();
//     _futureGyms = const ApiService().getGyms();
//   }

//   Future<void> _refresh() async {
//     await AuthManager().fetchLocation();
//     setState(() => _futureGyms = const ApiService().getGyms());
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: const GymKeyAppBar(title: 'GymKey', showMenu: true),
//       body: RefreshIndicator(
//         color: AppColors.secondary,
//         onRefresh: _refresh,
//         child: FutureBuilder<List<Gym>>(
//           future: _futureGyms,
//           builder: (context, snapshot) {
//             if (snapshot.connectionState == ConnectionState.waiting) {
//               return const Center(
//                 child: CircularProgressIndicator(color: AppColors.secondary),
//               );
//             }
//             if (snapshot.hasError) {
//               return Center(
//                 child: Text(
//                   'Error loading gyms.',
//                   style: AppTextStyles.bodyMD.copyWith(color: AppColors.error),
//                 ),
//               );
//             }
//             if (!snapshot.hasData || snapshot.data!.isEmpty) {
//               return Center(
//                 child: Text(
//                   'No gyms found nearby.',
//                   style: AppTextStyles.bodyMD.copyWith(
//                     color: AppColors.onSurfaceVariant,
//                   ),
//                 ),
//               );
//             }

//             final gyms = snapshot.data!;
//             return ListView(
//               padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
//               children: [
//                 Text('Check In', style: AppTextStyles.headlineXL),
//                 const SizedBox(height: 4),
//                 Text(
//                   'Select a studio to scan your QR code.',
//                   style: AppTextStyles.bodyMD.copyWith(
//                     color: AppColors.onSurfaceVariant,
//                   ),
//                 ),
//                 const SizedBox(height: 20),
//                 ...gyms.map(
//                   (gym) => Padding(
//                     padding: const EdgeInsets.only(bottom: 12),
//                     child: _CheckInGymCard(gym: gym),
//                   ),
//                 ),
//               ],
//             );
//           },
//         ),
//       ),
//     );
//   }
// }

// class _CheckInGymCard extends StatelessWidget {
//   final Gym gym;
//   const _CheckInGymCard({required this.gym});

//   Future<void> _handleCheckIn(BuildContext context) async {
//     final result = await Navigator.push(
//       context,
//       MaterialPageRoute(builder: (_) => QRScannerScreen(gym: gym)),
//     );
//     if (result == true) {
//       Navigator.push(
//         context,
//         MaterialPageRoute(builder: (_) => CheckInSuccessScreen(gym: gym)),
//       );
//     } else if (result is String) {
//       Navigator.push(
//         context,
//         MaterialPageRoute(
//           builder: (_) => CheckInFailureScreen(gym: gym, reason: result),
//         ),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       decoration: luxuryCardDecoration,
//       child: Row(
//         children: [
//           ClipRRect(
//             borderRadius: const BorderRadius.only(
//               topLeft: Radius.circular(16),
//               bottomLeft: Radius.circular(16),
//             ),
//             child: Image.network(
//               gym.imageUrl,
//               width: 82,
//               height: 82,
//               fit: BoxFit.cover,
//               errorBuilder: (_, __, ___) => Container(
//                 width: 82,
//                 height: 82,
//                 color: AppColors.surfaceContainerHigh,
//                 child: const Icon(
//                   Icons.fitness_center,
//                   color: AppColors.outline,
//                 ),
//               ),
//             ),
//           ),
//           Expanded(
//             child: Padding(
//               padding: const EdgeInsets.all(14),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     gym.name,
//                     style: AppTextStyles.labelMD.copyWith(
//                       fontWeight: FontWeight.w700,
//                       color: AppColors.primary,
//                     ),
//                     maxLines: 1,
//                     overflow: TextOverflow.ellipsis,
//                   ),
//                   const SizedBox(height: 3),
//                   Text(
//                     gym.address,
//                     style: AppTextStyles.labelSM.copyWith(
//                       fontWeight: FontWeight.w400,
//                     ),
//                     maxLines: 1,
//                     overflow: TextOverflow.ellipsis,
//                   ),
//                   const SizedBox(height: 4),
//                   Text(
//                     '${gym.distance.toStringAsFixed(1)} km away',
//                     style: AppTextStyles.labelSM.copyWith(
//                       color: AppColors.secondary,
//                       fontWeight: FontWeight.w600,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           Padding(
//             padding: const EdgeInsets.only(right: 14),
//             child: GestureDetector(
//               onTap: () => _handleCheckIn(context),
//               child: Container(
//                 padding: const EdgeInsets.symmetric(
//                   horizontal: 14,
//                   vertical: 10,
//                 ),
//                 decoration: BoxDecoration(
//                   color: AppColors.primaryContainer,
//                   borderRadius: BorderRadius.circular(99),
//                 ),
//                 child: const Text(
//                   'CHECK IN',
//                   style: TextStyle(
//                     fontFamily: 'Inter',
//                     color: Colors.white,
//                     fontWeight: FontWeight.w700,
//                     fontSize: 11,
//                     letterSpacing: 0.5,
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 12. QR SCANNER SCREEN
// // ===========================================================================

// class QRScannerScreen extends StatefulWidget {
//   final Gym gym;
//   const QRScannerScreen({super.key, required this.gym});

//   @override
//   State<QRScannerScreen> createState() => _QRScannerScreenState();
// }

// class _QRScannerScreenState extends State<QRScannerScreen> {
//   final MobileScannerController _ctrl = MobileScannerController(
//     detectionSpeed: DetectionSpeed.normal,
//     facing: CameraFacing.back,
//   );
//   final ApiService _api = const ApiService();
//   bool _isProcessing = false;

//   @override
//   void dispose() {
//     _ctrl.dispose();
//     super.dispose();
//   }

//   void _onDetect(BarcodeCapture capture) async {
//     if (_isProcessing) return;
//     final String? rawValue = capture.barcodes.first.rawValue;
//     if (rawValue == null || rawValue.trim().isEmpty) return;
//     await _ctrl.stop();
//     setState(() => _isProcessing = true);
//     try {
//       final bool success = await _api.checkInGym(
//         gymId: widget.gym.id,
//         qrToken: rawValue.trim(),
//       );
//       if (mounted) Navigator.pop(context, success);
//     } catch (e) {
//       String errorMessage = e.toString().replaceAll('Exception: ', '');
//       if (mounted) {
//         Navigator.pop(context, errorMessage);
//       }
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: Colors.black,
//       appBar: AppBar(
//         backgroundColor: AppColors.primaryContainer,
//         leading: IconButton(
//           icon: const Icon(Icons.close, color: Colors.white),
//           onPressed: () => Navigator.pop(context),
//         ),
//         title: Text(
//           'Check In at ${widget.gym.name}',
//           style: const TextStyle(
//             fontFamily: 'Inter',
//             color: Colors.white,
//             fontSize: 16,
//             fontWeight: FontWeight.w600,
//           ),
//           maxLines: 1,
//           overflow: TextOverflow.ellipsis,
//         ),
//         actions: [
//           IconButton(
//             icon: const Icon(Icons.flashlight_on, color: Colors.white),
//             onPressed: () => _ctrl.toggleTorch(),
//           ),
//         ],
//       ),
//       body: Stack(
//         children: [
//           MobileScanner(
//             controller: _ctrl,
//             onDetect: _onDetect,
//             errorBuilder: (context, error, child) => Center(
//               child: Text(
//                 'Camera Error: ${error.toString()}',
//                 style: const TextStyle(color: Colors.white),
//                 textAlign: TextAlign.center,
//               ),
//             ),
//           ),
//           // Radial overlay
//           Container(
//             decoration: const BoxDecoration(
//               gradient: RadialGradient(
//                 center: Alignment.center,
//                 radius: 0.5,
//                 colors: [Colors.transparent, Color(0xBB000000)],
//               ),
//             ),
//           ),
//           // Scanner brackets
//           Center(
//             child: SizedBox(
//               width: 220,
//               height: 220,
//               child: Stack(
//                 children: [
//                   Positioned(top: 0, left: 0, child: _bracket(topLeft: true)),
//                   Positioned(top: 0, right: 0, child: _bracket(topRight: true)),
//                   Positioned(
//                     bottom: 0,
//                     left: 0,
//                     child: _bracket(bottomLeft: true),
//                   ),
//                   Positioned(
//                     bottom: 0,
//                     right: 0,
//                     child: _bracket(bottomRight: true),
//                   ),
//                   const Align(
//                     alignment: Alignment.bottomCenter,
//                     child: Padding(
//                       padding: EdgeInsets.only(bottom: 16),
//                       child: Text(
//                         'Center the QR code',
//                         style: TextStyle(
//                           color: Colors.white70,
//                           fontFamily: 'Inter',
//                           fontSize: 14,
//                         ),
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ),
//           if (_isProcessing)
//             Container(
//               color: Colors.black.withOpacity(0.75),
//               child: const Center(
//                 child: Column(
//                   mainAxisSize: MainAxisSize.min,
//                   children: [
//                     CircularProgressIndicator(color: Colors.white),
//                     SizedBox(height: 20),
//                     Text(
//                       'Checking in...',
//                       style: TextStyle(
//                         color: Colors.white,
//                         fontFamily: 'Inter',
//                         fontSize: 16,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//         ],
//       ),
//     );
//   }

//   Widget _bracket({
//     bool topLeft = false,
//     bool topRight = false,
//     bool bottomLeft = false,
//     bool bottomRight = false,
//   }) {
//     return Container(
//       width: 36,
//       height: 36,
//       decoration: BoxDecoration(
//         border: Border(
//           top: topLeft || topRight
//               ? const BorderSide(color: Colors.white, width: 3.5)
//               : BorderSide.none,
//           bottom: bottomLeft || bottomRight
//               ? const BorderSide(color: Colors.white, width: 3.5)
//               : BorderSide.none,
//           left: topLeft || bottomLeft
//               ? const BorderSide(color: Colors.white, width: 3.5)
//               : BorderSide.none,
//           right: topRight || bottomRight
//               ? const BorderSide(color: Colors.white, width: 3.5)
//               : BorderSide.none,
//         ),
//         borderRadius: BorderRadius.only(
//           topLeft: topLeft ? const Radius.circular(8) : Radius.zero,
//           topRight: topRight ? const Radius.circular(8) : Radius.zero,
//           bottomLeft: bottomLeft ? const Radius.circular(8) : Radius.zero,
//           bottomRight: bottomRight ? const Radius.circular(8) : Radius.zero,
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 13. CHECK IN SUCCESS / FAILURE SCREENS
// // ===========================================================================

// class CheckInSuccessScreen extends StatelessWidget {
//   final Gym gym;
//   const CheckInSuccessScreen({required this.gym, super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(title: 'GymKey', actions: []),
//       body: Center(
//         child: Padding(
//           padding: const EdgeInsets.all(24),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Container(
//                 width: 96,
//                 height: 96,
//                 decoration: BoxDecoration(
//                   color: AppColors.secondary,
//                   shape: BoxShape.circle,
//                   border: Border.all(
//                     color: AppColors.surfaceContainerLow,
//                     width: 4,
//                   ),
//                   boxShadow: [
//                     BoxShadow(
//                       color: AppColors.secondary.withOpacity(0.35),
//                       blurRadius: 24,
//                       offset: const Offset(0, 8),
//                     ),
//                   ],
//                 ),
//                 child: const Icon(
//                   Icons.check_circle,
//                   color: Colors.white,
//                   size: 52,
//                 ),
//               ),
//               const SizedBox(height: 24),
//               Text(
//                 'Check-in Success!',
//                 style: AppTextStyles.headlineXL,
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 8),
//               Text(
//                 "You're all set for your session.",
//                 style: AppTextStyles.bodyMD.copyWith(
//                   color: AppColors.onSurfaceVariant,
//                 ),
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 32),
//               Container(
//                 width: double.infinity,
//                 padding: const EdgeInsets.all(20),
//                 decoration: luxuryCardDecoration,
//                 child: Column(
//                   children: [
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                       children: [
//                         Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               'LOCATION',
//                               style: AppTextStyles.labelSM.copyWith(
//                                 color: AppColors.secondary,
//                                 letterSpacing: 1.5,
//                               ),
//                             ),
//                             const SizedBox(height: 4),
//                             Text(gym.name, style: AppTextStyles.headlineMD),
//                           ],
//                         ),
//                         const Icon(
//                           Icons.verified_rounded,
//                           color: AppColors.secondary,
//                           size: 28,
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 16),
//                     Divider(color: AppColors.outlineVariant),
//                     const SizedBox(height: 12),
//                     Row(
//                       children: [
//                         Expanded(
//                           child: Column(
//                             crossAxisAlignment: CrossAxisAlignment.start,
//                             children: [
//                               Text(
//                                 'Time',
//                                 style: AppTextStyles.labelSM.copyWith(
//                                   color: AppColors.onSurfaceVariant,
//                                 ),
//                               ),
//                               const SizedBox(height: 2),
//                               Text(
//                                 '${TimeOfDay.now().format(context)}',
//                                 style: AppTextStyles.bodyMD.copyWith(
//                                   fontWeight: FontWeight.w600,
//                                 ),
//                               ),
//                             ],
//                           ),
//                         ),
//                         Expanded(
//                           child: Column(
//                             crossAxisAlignment: CrossAxisAlignment.start,
//                             children: [
//                               Text(
//                                 'Status',
//                                 style: AppTextStyles.labelSM.copyWith(
//                                   color: AppColors.onSurfaceVariant,
//                                 ),
//                               ),
//                               const SizedBox(height: 2),
//                               Text(
//                                 'Confirmed',
//                                 style: AppTextStyles.bodyMD.copyWith(
//                                   color: AppColors.secondary,
//                                   fontWeight: FontWeight.w600,
//                                 ),
//                               ),
//                             ],
//                           ),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//               const SizedBox(height: 32),
//               SizedBox(
//                 width: double.infinity,
//                 height: 54,
//                 child: ElevatedButton(
//                   onPressed: () => Navigator.pushNamedAndRemoveUntil(
//                     context,
//                     AppRoutes.home,
//                     (r) => false,
//                   ),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primaryContainer,
//                     foregroundColor: Colors.white,
//                     shape: const StadiumBorder(),
//                   ),
//                   child: const Text(
//                     'Back to Home',
//                     style: TextStyle(
//                       fontFamily: 'Inter',
//                       fontWeight: FontWeight.w600,
//                       fontSize: 16,
//                     ),
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// class CheckInFailureScreen extends StatelessWidget {
//   final Gym gym;
//   final String reason;
//   const CheckInFailureScreen({
//     required this.gym,
//     required this.reason,
//     super.key,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(title: 'GymKey', actions: []),
//       body: Center(
//         child: Padding(
//           padding: const EdgeInsets.all(24),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Container(
//                 width: 96,
//                 height: 96,
//                 decoration: BoxDecoration(
//                   color: AppColors.errorContainer,
//                   shape: BoxShape.circle,
//                 ),
//                 child: const Icon(
//                   Icons.error_outline_rounded,
//                   color: AppColors.error,
//                   size: 52,
//                 ),
//               ),
//               const SizedBox(height: 24),
//               Text(
//                 'Check-in Failed',
//                 style: AppTextStyles.headlineXL,
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 8),
//               Text(
//                 'We encountered an issue validating your access at ${gym.name}.',
//                 style: AppTextStyles.bodyMD.copyWith(
//                   color: AppColors.onSurfaceVariant,
//                 ),
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 24),
//               Container(
//                 width: double.infinity,
//                 padding: const EdgeInsets.all(16),
//                 decoration: BoxDecoration(
//                   color: AppColors.surfaceContainerLow,
//                   borderRadius: BorderRadius.circular(14),
//                   border: const Border(
//                     left: BorderSide(color: AppColors.error, width: 4),
//                   ),
//                 ),
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       'REASON',
//                       style: AppTextStyles.labelSM.copyWith(
//                         color: AppColors.onSurfaceVariant,
//                         letterSpacing: 1.5,
//                       ),
//                     ),
//                     const SizedBox(height: 6),
//                     Text(
//                       reason,
//                       style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
//                     ),
//                   ],
//                 ),
//               ),
//               const SizedBox(height: 32),
//               SizedBox(
//                 width: double.infinity,
//                 height: 54,
//                 child: ElevatedButton(
//                   onPressed: () => Navigator.pop(context),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primaryContainer,
//                     foregroundColor: Colors.white,
//                     shape: const StadiumBorder(),
//                   ),
//                   child: const Text(
//                     'Try Again',
//                     style: TextStyle(
//                       fontFamily: 'Inter',
//                       fontWeight: FontWeight.w600,
//                       fontSize: 16,
//                     ),
//                   ),
//                 ),
//               ),
//               const SizedBox(height: 12),
//               TextButton(
//                 onPressed: () =>
//                     Navigator.pushNamed(context, AppRoutes.subscription),
//                 child: Text(
//                   'Upgrade Plan',
//                   style: AppTextStyles.bodyMD.copyWith(
//                     color: AppColors.secondary,
//                     fontWeight: FontWeight.w600,
//                   ),
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 14. FIND GYM SCREEN
// // ===========================================================================

// class FindGymScreen extends StatefulWidget {
//   const FindGymScreen({super.key});

//   @override
//   State<FindGymScreen> createState() => _FindGymScreenState();
// }

// class _FindGymScreenState extends State<FindGymScreen> {
//   bool isMapView = false;
//   late Future<List<Gym>> _futureGyms;
//   String _selectedFilter = 'All';
//   final List<String> _filters = [
//     'All',
//     'Yoga',
//     'HIIT',
//     'Strength',
//     'Boxing',
//     'Spin',
//   ];

//   @override
//   void initState() {
//     super.initState();
//     _futureGyms = const ApiService().getGyms();
//   }

//   Future<void> _refresh() async {
//     await AuthManager().fetchLocation();
//     setState(() => _futureGyms = const ApiService().getGyms());
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: const GymKeyAppBar(title: 'GymKey', showMenu: true),
//       body: RefreshIndicator(
//         color: AppColors.secondary,
//         onRefresh: _refresh,
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Search & Location Bar
//             Container(
//               color: AppColors.background,
//               padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   // Location
//                   ValueListenableBuilder<bool>(
//                     valueListenable: AuthManager().locationStatusNotifier,
//                     builder: (context, isReady, _) => Row(
//                       children: [
//                         const Icon(
//                           Icons.person_pin_circle_outlined,
//                           size: 22,
//                           color: AppColors.secondary,
//                         ),
//                         const SizedBox(width: 8),
//                         Expanded(
//                           child: Column(
//                             crossAxisAlignment: CrossAxisAlignment.start,
//                             children: [
//                               Text(
//                                 'YOUR LOCATION',
//                                 style: AppTextStyles.labelSM.copyWith(
//                                   fontSize: 10,
//                                   letterSpacing: 1.5,
//                                   color: AppColors.onSurfaceVariant,
//                                 ),
//                               ),
//                               Text(
//                                 AuthManager().currentAddress,
//                                 style: AppTextStyles.labelMD.copyWith(
//                                   fontWeight: FontWeight.w600,
//                                 ),
//                                 maxLines: 1,
//                                 overflow: TextOverflow.ellipsis,
//                               ),
//                             ],
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                   const SizedBox(height: 14),
//                   // Search field
//                   TextField(
//                     decoration: const InputDecoration(
//                       hintText: 'Search studios, gyms or classes...',
//                       prefixIcon: Icon(Icons.search, color: AppColors.outline),
//                     ),
//                   ),
//                   const SizedBox(height: 14),
//                   // Map / List toggle
//                   Row(
//                     children: [
//                       Expanded(
//                         child: GestureDetector(
//                           onTap: () => setState(() => isMapView = true),
//                           child: Container(
//                             height: 44,
//                             decoration: BoxDecoration(
//                               color: isMapView
//                                   ? AppColors.primaryContainer
//                                   : AppColors.surfaceContainerHigh,
//                               borderRadius: BorderRadius.circular(10),
//                             ),
//                             alignment: Alignment.center,
//                             child: Row(
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 Icon(
//                                   Icons.map_outlined,
//                                   size: 16,
//                                   color: isMapView
//                                       ? Colors.white
//                                       : AppColors.onSurfaceVariant,
//                                 ),
//                                 const SizedBox(width: 6),
//                                 Text(
//                                   'Map View',
//                                   style: AppTextStyles.labelMD.copyWith(
//                                     color: isMapView
//                                         ? Colors.white
//                                         : AppColors.onSurfaceVariant,
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ),
//                         ),
//                       ),
//                       const SizedBox(width: 10),
//                       Expanded(
//                         child: GestureDetector(
//                           onTap: () => setState(() => isMapView = false),
//                           child: Container(
//                             height: 44,
//                             decoration: BoxDecoration(
//                               color: !isMapView
//                                   ? AppColors.primaryContainer
//                                   : AppColors.surfaceContainerHigh,
//                               borderRadius: BorderRadius.circular(10),
//                             ),
//                             alignment: Alignment.center,
//                             child: Row(
//                               mainAxisAlignment: MainAxisAlignment.center,
//                               children: [
//                                 Icon(
//                                   Icons.list,
//                                   size: 16,
//                                   color: !isMapView
//                                       ? Colors.white
//                                       : AppColors.onSurfaceVariant,
//                                 ),
//                                 const SizedBox(width: 6),
//                                 Text(
//                                   'List View',
//                                   style: AppTextStyles.labelMD.copyWith(
//                                     color: !isMapView
//                                         ? Colors.white
//                                         : AppColors.onSurfaceVariant,
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 12),
//                   // Filter chips
//                   SizedBox(
//                     height: 36,
//                     child: ListView.separated(
//                       scrollDirection: Axis.horizontal,
//                       itemCount: _filters.length,
//                       separatorBuilder: (_, __) => const SizedBox(width: 8),
//                       itemBuilder: (context, i) {
//                         final isSelected = _selectedFilter == _filters[i];
//                         return GestureDetector(
//                           onTap: () =>
//                               setState(() => _selectedFilter = _filters[i]),
//                           child: Container(
//                             padding: const EdgeInsets.symmetric(
//                               horizontal: 16,
//                               vertical: 8,
//                             ),
//                             decoration: BoxDecoration(
//                               color: isSelected
//                                   ? AppColors.primaryContainer
//                                   : AppColors.surfaceContainerHigh,
//                               borderRadius: BorderRadius.circular(99),
//                               border: isSelected
//                                   ? null
//                                   : Border.all(color: AppColors.outlineVariant),
//                             ),
//                             child: Text(
//                               _filters[i],
//                               style: AppTextStyles.labelMD.copyWith(
//                                 color: isSelected
//                                     ? Colors.white
//                                     : AppColors.onSurfaceVariant,
//                                 fontSize: 13,
//                               ),
//                             ),
//                           ),
//                         );
//                       },
//                     ),
//                   ),
//                   const SizedBox(height: 12),
//                 ],
//               ),
//             ),
//             // Content
//             Expanded(
//               child: FutureBuilder<List<Gym>>(
//                 future: _futureGyms,
//                 builder: (context, snapshot) {
//                   if (snapshot.connectionState == ConnectionState.waiting)
//                     return const Center(
//                       child: CircularProgressIndicator(
//                         color: AppColors.secondary,
//                       ),
//                     );
//                   if (snapshot.hasError ||
//                       !snapshot.hasData ||
//                       snapshot.data!.isEmpty) {
//                     return Center(
//                       child: Text(
//                         'No gyms available.',
//                         style: AppTextStyles.bodyMD.copyWith(
//                           color: AppColors.onSurfaceVariant,
//                         ),
//                       ),
//                     );
//                   }
//                   final gyms = snapshot.data!;
//                   if (isMapView) {
//                     return GymMapView(gyms: gyms);
//                   }
//                   return ListView.separated(
//                     padding: const EdgeInsets.fromLTRB(20, 4, 20, 100),
//                     itemCount: gyms.length,
//                     separatorBuilder: (_, __) => const SizedBox(height: 12),
//                     itemBuilder: (context, i) =>
//                         LuxuryGymCard(gym: gyms[i], compact: true),
//                   );
//                 },
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class GymMapView extends StatefulWidget {
//   final List<Gym> gyms;
//   const GymMapView({super.key, required this.gyms});

//   @override
//   State<GymMapView> createState() => _GymMapViewState();
// }

// class _GymMapViewState extends State<GymMapView> {
//   late final fm.MapController _mapController;
//   latlng.LatLng _userLocation = latlng.LatLng(33.741, 72.785);

//   @override
//   void initState() {
//     super.initState();
//     _mapController = fm.MapController();
//     final loc = AuthManager().currentLocation;
//     if (loc != null) _userLocation = latlng.LatLng(loc.latitude, loc.longitude);
//   }

//   @override
//   Widget build(BuildContext context) {
//     return fm.FlutterMap(
//       mapController: _mapController,
//       options: fm.MapOptions(
//         initialCenter: _userLocation,
//         initialZoom: 13,
//         maxZoom: 18,
//         minZoom: 5,
//       ),
//       children: [
//         fm.TileLayer(
//           urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
//           subdomains: const ['a', 'b', 'c'],
//           userAgentPackageName: 'com.gymkey.app',
//         ),
//         fm.MarkerLayer(
//           markers: [
//             fm.Marker(
//               point: _userLocation,
//               width: 50,
//               height: 50,
//               child: Container(
//                 decoration: BoxDecoration(
//                   color: AppColors.secondary,
//                   shape: BoxShape.circle,
//                   border: Border.all(color: Colors.white, width: 2),
//                 ),
//                 child: const Icon(Icons.person, color: Colors.white, size: 22),
//               ),
//             ),
//             ...widget.gyms.map(
//               (gym) => fm.Marker(
//                 point: latlng.LatLng(gym.latitude, gym.longitude),
//                 width: 44,
//                 height: 44,
//                 child: GestureDetector(
//                   onTap: () => showModalBottomSheet(
//                     context: context,
//                     backgroundColor: Colors.transparent,
//                     builder: (_) => Container(
//                       margin: const EdgeInsets.all(12),
//                       decoration: luxuryCardDecoration,
//                       padding: const EdgeInsets.all(20),
//                       child: Column(
//                         mainAxisSize: MainAxisSize.min,
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text(gym.name, style: AppTextStyles.headlineMD),
//                           const SizedBox(height: 4),
//                           Text(
//                             gym.address,
//                             style: AppTextStyles.bodyMD.copyWith(
//                               color: AppColors.onSurfaceVariant,
//                             ),
//                           ),
//                           const SizedBox(height: 12),
//                           SizedBox(
//                             width: double.infinity,
//                             height: 48,
//                             child: ElevatedButton(
//                               onPressed: () {
//                                 Navigator.pop(context);
//                                 Navigator.pushNamed(
//                                   context,
//                                   AppRoutes.gymDetails,
//                                   arguments: gym,
//                                 );
//                               },
//                               style: ElevatedButton.styleFrom(
//                                 backgroundColor: AppColors.primaryContainer,
//                                 foregroundColor: Colors.white,
//                                 shape: const StadiumBorder(),
//                               ),
//                               child: const Text(
//                                 'View Details',
//                                 style: TextStyle(
//                                   fontFamily: 'Inter',
//                                   fontWeight: FontWeight.w600,
//                                 ),
//                               ),
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                   child: Container(
//                     decoration: BoxDecoration(
//                       color: AppColors.primaryContainer,
//                       shape: BoxShape.circle,
//                       border: Border.all(color: Colors.white, width: 2),
//                     ),
//                     child: const Icon(
//                       Icons.fitness_center,
//                       color: Colors.white,
//                       size: 20,
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ],
//     );
//   }
// }

// // ===========================================================================
// // 15. PROFILE SCREEN
// // ===========================================================================

// class ProfileScreen extends StatelessWidget {
//   const ProfileScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final user = AuthManager().user;
//     final hasActivePlan = user?.membershipTier != null;
//     final initials = user?.name.isNotEmpty == true
//         ? user!.name[0].toUpperCase()
//         : 'U';

//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: const GymKeyAppBar(title: 'GymKey', showMenu: true),
//       body: SingleChildScrollView(
//         physics: const AlwaysScrollableScrollPhysics(),
//         padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Profile header
//             Center(
//               child: Column(
//                 children: [
//                   Stack(
//                     children: [
//                       CircleAvatar(
//                         radius: 52,
//                         backgroundColor: AppColors.primaryContainer,
//                         child: Text(
//                           initials,
//                           style: const TextStyle(
//                             fontFamily: 'Inter',
//                             fontSize: 40,
//                             color: Colors.white,
//                             fontWeight: FontWeight.w700,
//                           ),
//                         ),
//                       ),
//                       Positioned(
//                         bottom: 0,
//                         right: 0,
//                         child: Container(
//                           width: 32,
//                           height: 32,
//                           decoration: BoxDecoration(
//                             color: AppColors.primary,
//                             shape: BoxShape.circle,
//                             border: Border.all(
//                               color: AppColors.background,
//                               width: 2,
//                             ),
//                           ),
//                           child: const Icon(
//                             Icons.edit,
//                             size: 16,
//                             color: Colors.white,
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 14),
//                   Text(
//                     user?.name ?? 'Guest User',
//                     style: AppTextStyles.headlineMD,
//                   ),
//                   const SizedBox(height: 6),
//                   if (hasActivePlan)
//                     Container(
//                       padding: const EdgeInsets.symmetric(
//                         horizontal: 14,
//                         vertical: 6,
//                       ),
//                       decoration: BoxDecoration(
//                         color: AppColors.secondaryContainer,
//                         borderRadius: BorderRadius.circular(99),
//                       ),
//                       child: Row(
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           const Icon(
//                             Icons.workspace_premium_rounded,
//                             size: 14,
//                             color: AppColors.onSecondaryContainer,
//                           ),
//                           const SizedBox(width: 6),
//                           Text(
//                             user!.membershipTier ?? '',
//                             style: AppTextStyles.labelSM.copyWith(
//                               color: AppColors.onSecondaryContainer,
//                               fontWeight: FontWeight.w700,
//                             ),
//                           ),
//                         ],
//                       ),
//                     )
//                   else
//                     Text(
//                       user?.email ?? '',
//                       style: AppTextStyles.bodyMD.copyWith(
//                         color: AppColors.onSurfaceVariant,
//                       ),
//                     ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 28),

//             // Membership card
//             Container(
//               width: double.infinity,
//               padding: const EdgeInsets.all(18),
//               decoration: BoxDecoration(
//                 color: hasActivePlan
//                     ? AppColors.secondary.withOpacity(0.08)
//                     : const Color(0xFFFFF7ED),
//                 borderRadius: BorderRadius.circular(16),
//                 border: Border.all(
//                   color: hasActivePlan
//                       ? AppColors.secondary.withOpacity(0.4)
//                       : const Color(0xFFFBBF24),
//                 ),
//               ),
//               child: Row(
//                 children: [
//                   Icon(
//                     hasActivePlan
//                         ? Icons.verified_rounded
//                         : Icons.warning_amber_rounded,
//                     color: hasActivePlan
//                         ? AppColors.secondary
//                         : const Color(0xFFD97706),
//                     size: 28,
//                   ),
//                   const SizedBox(width: 14),
//                   Expanded(
//                     child: Column(
//                       crossAxisAlignment: CrossAxisAlignment.start,
//                       children: [
//                         Text(
//                           hasActivePlan
//                               ? 'Active Subscription'
//                               : 'No Active Subscription',
//                           style: AppTextStyles.labelMD.copyWith(
//                             fontWeight: FontWeight.w700,
//                           ),
//                         ),
//                         const SizedBox(height: 2),
//                         Text(
//                           hasActivePlan
//                               ? user!.membershipTier!
//                               : 'Upgrade to access gyms',
//                           style: AppTextStyles.labelSM.copyWith(
//                             fontWeight: FontWeight.w400,
//                             color: AppColors.onSurfaceVariant,
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                   if (!hasActivePlan)
//                     GestureDetector(
//                       onTap: () =>
//                           Navigator.pushNamed(context, AppRoutes.subscription),
//                       child: Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: 12,
//                           vertical: 7,
//                         ),
//                         decoration: BoxDecoration(
//                           color: const Color(0xFFD97706),
//                           borderRadius: BorderRadius.circular(99),
//                         ),
//                         child: const Text(
//                           'Upgrade',
//                           style: TextStyle(
//                             fontFamily: 'Inter',
//                             color: Colors.white,
//                             fontWeight: FontWeight.w600,
//                             fontSize: 13,
//                           ),
//                         ),
//                       ),
//                     ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 24),
//             Text(
//               'Account Information',
//               style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
//             ),
//             const SizedBox(height: 12),
//             _infoRow(
//               Icons.phone_outlined,
//               'Phone',
//               user?.phone ?? 'Not provided',
//             ),
//             _infoRow(Icons.mail_outline, 'Email', user?.email ?? 'N/A'),
//             _infoRow(
//               Icons.calendar_today_outlined,
//               'Member Since',
//               user?.formattedCreatedAt ?? 'N/A',
//             ),

//             const SizedBox(height: 24),
//             Text(
//               'Activity & Settings',
//               style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
//             ),
//             const SizedBox(height: 12),

//             _menuRow(
//               context,
//               Icons.history,
//               'Check-in History',
//               () => Navigator.pushNamed(context, AppRoutes.checkInHistory),
//             ),
//             _menuRow(
//               context,
//               Icons.auto_awesome,
//               'AI Fitness Onboarding',
//               () => Navigator.pushNamed(context, AppRoutes.aiOnboarding),
//             ),
//             _menuRow(
//               context,
//               Icons.subscriptions_outlined,
//               'Manage Subscription',
//               () => Navigator.pushNamed(context, AppRoutes.subscription),
//             ),
//             _menuRow(
//               context,
//               Icons.notifications_outlined,
//               'Notifications',
//               () => Navigator.pushNamed(context, AppRoutes.notifications),
//             ),

//             const SizedBox(height: 12),
//             Divider(color: AppColors.outlineVariant),
//             const SizedBox(height: 12),

//             // Logout
//             GestureDetector(
//               onTap: () {
//                 AuthManager().logout();
//                 Navigator.pushNamedAndRemoveUntil(
//                   context,
//                   AppRoutes.auth,
//                   (r) => false,
//                 );
//               },
//               child: Container(
//                 width: double.infinity,
//                 padding: const EdgeInsets.all(16),
//                 decoration: BoxDecoration(
//                   color: AppColors.errorContainer.withOpacity(0.4),
//                   borderRadius: BorderRadius.circular(14),
//                   border: Border.all(color: AppColors.error.withOpacity(0.2)),
//                 ),
//                 child: Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     const Icon(
//                       Icons.logout_rounded,
//                       color: AppColors.error,
//                       size: 20,
//                     ),
//                     const SizedBox(width: 10),
//                     Text(
//                       'Sign Out',
//                       style: AppTextStyles.labelMD.copyWith(
//                         color: AppColors.error,
//                         fontWeight: FontWeight.w700,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _infoRow(IconData icon, String label, String value) {
//     return Padding(
//       padding: const EdgeInsets.symmetric(vertical: 8),
//       child: Row(
//         children: [
//           Icon(icon, size: 18, color: AppColors.secondary),
//           const SizedBox(width: 14),
//           Column(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Text(
//                 label,
//                 style: AppTextStyles.labelSM.copyWith(
//                   color: AppColors.onSurfaceVariant,
//                   fontWeight: FontWeight.w400,
//                 ),
//               ),
//               Text(
//                 value,
//                 style: AppTextStyles.bodyMD.copyWith(
//                   fontWeight: FontWeight.w600,
//                 ),
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _menuRow(
//     BuildContext context,
//     IconData icon,
//     String title,
//     VoidCallback onTap,
//   ) {
//     return Padding(
//       padding: const EdgeInsets.symmetric(vertical: 2),
//       child: Material(
//         color: Colors.transparent,
//         child: InkWell(
//           borderRadius: BorderRadius.circular(12),
//           onTap: onTap,
//           child: Padding(
//             padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
//             child: Row(
//               children: [
//                 Icon(icon, size: 20, color: AppColors.onSurfaceVariant),
//                 const SizedBox(width: 14),
//                 Expanded(
//                   child: Text(
//                     title,
//                     style: AppTextStyles.bodyMD.copyWith(
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                 ),
//                 const Icon(
//                   Icons.chevron_right,
//                   size: 20,
//                   color: AppColors.outline,
//                 ),
//               ],
//             ),
//           ),
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 16. GYM DETAIL SCREEN
// // ===========================================================================

// class GymDetailScreen extends StatelessWidget {
//   final Gym gym;
//   const GymDetailScreen({required this.gym, super.key});

//   @override
//   Widget build(BuildContext context) {
//     final isPremium = gym.planType.toLowerCase() == 'premium';
//     return Scaffold(
//       extendBodyBehindAppBar: true,
//       appBar: AppBar(
//         backgroundColor: Colors.transparent,
//         elevation: 0,
//         leading: GestureDetector(
//           onTap: () => Navigator.pop(context),
//           child: Container(
//             margin: const EdgeInsets.all(8),
//             decoration: BoxDecoration(
//               color: Colors.black.withOpacity(0.35),
//               shape: BoxShape.circle,
//             ),
//             child: const Icon(Icons.arrow_back, color: Colors.white),
//           ),
//         ),
//         actions: [
//           GestureDetector(
//             child: Container(
//               margin: const EdgeInsets.all(8),
//               decoration: BoxDecoration(
//                 color: Colors.black.withOpacity(0.35),
//                 shape: BoxShape.circle,
//               ),
//               child: const Icon(Icons.favorite_border, color: Colors.white),
//             ),
//           ),
//         ],
//       ),
//       body: SingleChildScrollView(
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Hero Image
//             Stack(
//               children: [
//                 SizedBox(
//                   height: 320,
//                   width: double.infinity,
//                   child: Image.network(
//                     gym.imageUrl,
//                     fit: BoxFit.cover,
//                     errorBuilder: (_, __, ___) => Container(
//                       height: 320,
//                       color: AppColors.surfaceContainerHigh,
//                       child: const Center(
//                         child: Icon(
//                           Icons.fitness_center,
//                           size: 60,
//                           color: AppColors.outline,
//                         ),
//                       ),
//                     ),
//                   ),
//                 ),
//                 Positioned(
//                   bottom: 0,
//                   left: 0,
//                   right: 0,
//                   child: Container(
//                     height: 160,
//                     decoration: const BoxDecoration(
//                       gradient: LinearGradient(
//                         begin: Alignment.topCenter,
//                         end: Alignment.bottomCenter,
//                         colors: [Colors.transparent, Color(0xDD0D0300)],
//                       ),
//                     ),
//                   ),
//                 ),
//                 Positioned(
//                   bottom: 20,
//                   left: 20,
//                   right: 20,
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Row(
//                         children: [
//                           Container(
//                             padding: const EdgeInsets.symmetric(
//                               horizontal: 10,
//                               vertical: 5,
//                             ),
//                             decoration: BoxDecoration(
//                               color: isPremium
//                                   ? AppColors.secondary
//                                   : AppColors.primaryContainer,
//                               borderRadius: BorderRadius.circular(99),
//                             ),
//                             child: Text(
//                               gym.planType.toUpperCase() + ' MEMBERSHIP',
//                               style: const TextStyle(
//                                 fontFamily: 'Inter',
//                                 color: Colors.white,
//                                 fontSize: 11,
//                                 fontWeight: FontWeight.w700,
//                                 letterSpacing: 1,
//                               ),
//                             ),
//                           ),
//                           const SizedBox(width: 8),
//                           Container(
//                             padding: const EdgeInsets.symmetric(
//                               horizontal: 10,
//                               vertical: 5,
//                             ),
//                             decoration: BoxDecoration(
//                               color: Colors.white.withOpacity(0.15),
//                               borderRadius: BorderRadius.circular(99),
//                             ),
//                             child: const Row(
//                               children: [
//                                 Icon(
//                                   Icons.star_rounded,
//                                   size: 14,
//                                   color: Colors.white,
//                                 ),
//                                 SizedBox(width: 3),
//                                 Text(
//                                   '4.9',
//                                   style: TextStyle(
//                                     fontFamily: 'Inter',
//                                     color: Colors.white,
//                                     fontSize: 12,
//                                     fontWeight: FontWeight.w600,
//                                   ),
//                                 ),
//                               ],
//                             ),
//                           ),
//                         ],
//                       ),
//                       const SizedBox(height: 8),
//                       Text(
//                         gym.name,
//                         style: const TextStyle(
//                           fontFamily: 'Inter',
//                           color: Colors.white,
//                           fontSize: 28,
//                           fontWeight: FontWeight.w700,
//                           height: 1.1,
//                         ),
//                       ),
//                       const SizedBox(height: 4),
//                       Row(
//                         children: [
//                           const Icon(
//                             Icons.location_on_outlined,
//                             color: Colors.white70,
//                             size: 15,
//                           ),
//                           const SizedBox(width: 4),
//                           Expanded(
//                             child: Text(
//                               gym.address,
//                               style: const TextStyle(
//                                 fontFamily: 'Inter',
//                                 color: Colors.white70,
//                                 fontSize: 14,
//                               ),
//                               maxLines: 1,
//                               overflow: TextOverflow.ellipsis,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ],
//                   ),
//                 ),
//               ],
//             ),

//             Padding(
//               padding: const EdgeInsets.all(20),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   // Stats row
//                   Row(
//                     children: [
//                       Expanded(
//                         child: _statBox(
//                           '${gym.distance.toStringAsFixed(1)} km',
//                           'Distance',
//                           Icons.near_me_rounded,
//                         ),
//                       ),
//                       const SizedBox(width: 12),
//                       Expanded(
//                         child: _statBox(
//                           gym.planType,
//                           'Plan Tier',
//                           Icons.star_rounded,
//                         ),
//                       ),
//                       const SizedBox(width: 12),
//                       Expanded(
//                         child: _statBox(
//                           'Open',
//                           'Status',
//                           Icons.access_time_rounded,
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 24),

//                   // Facilities
//                   Text('Facilities', style: AppTextStyles.headlineMD),
//                   const SizedBox(height: 12),
//                   gym.facilities.isEmpty
//                       ? Text(
//                           'Facilities info not available.',
//                           style: AppTextStyles.bodyMD.copyWith(
//                             color: AppColors.onSurfaceVariant,
//                           ),
//                         )
//                       : Wrap(
//                           spacing: 8,
//                           runSpacing: 8,
//                           children: gym.facilities
//                               .map(
//                                 (f) => Container(
//                                   padding: const EdgeInsets.symmetric(
//                                     horizontal: 14,
//                                     vertical: 8,
//                                   ),
//                                   decoration: BoxDecoration(
//                                     color: AppColors.secondaryContainer
//                                         .withOpacity(0.4),
//                                     borderRadius: BorderRadius.circular(99),
//                                   ),
//                                   child: Text(
//                                     f,
//                                     style: AppTextStyles.labelMD.copyWith(
//                                       color: AppColors.onSecondaryContainer,
//                                     ),
//                                   ),
//                                 ),
//                               )
//                               .toList(),
//                         ),

//                   const SizedBox(height: 24),

//                   // Operating Hours
//                   Text('Operating Hours', style: AppTextStyles.headlineMD),
//                   const SizedBox(height: 12),
//                   ...gym.hours.entries.map(
//                     (e) => Padding(
//                       padding: const EdgeInsets.symmetric(vertical: 6),
//                       child: Row(
//                         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                         children: [
//                           Text(
//                             e.key,
//                             style: AppTextStyles.bodyMD.copyWith(
//                               fontWeight: FontWeight.w500,
//                             ),
//                           ),
//                           Text(
//                             e.value,
//                             style: AppTextStyles.bodyMD.copyWith(
//                               color: AppColors.onSurfaceVariant,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),

//             // Check in button
//             Padding(
//               padding: const EdgeInsets.fromLTRB(20, 0, 20, 40),
//               child: SizedBox(
//                 width: double.infinity,
//                 height: 56,
//                 child: ElevatedButton.icon(
//                   onPressed: () => Navigator.pushNamed(context, AppRoutes.home),
//                   icon: const Icon(Icons.qr_code_scanner, color: Colors.white),
//                   label: const Text(
//                     'Check In at This Gym',
//                     style: TextStyle(
//                       fontFamily: 'Inter',
//                       color: Colors.white,
//                       fontWeight: FontWeight.w600,
//                       fontSize: 16,
//                     ),
//                   ),
//                   style: ElevatedButton.styleFrom(
//                     backgroundColor: AppColors.primaryContainer,
//                     foregroundColor: Colors.white,
//                     shape: const StadiumBorder(),
//                     elevation: 0,
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _statBox(String value, String label, IconData icon) {
//     return Container(
//       padding: const EdgeInsets.all(12),
//       decoration: BoxDecoration(
//         color: AppColors.surfaceContainerLow,
//         borderRadius: BorderRadius.circular(12),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Icon(icon, color: AppColors.secondary, size: 18),
//           const SizedBox(height: 6),
//           Text(
//             value,
//             style: AppTextStyles.labelMD.copyWith(
//               fontWeight: FontWeight.w700,
//               color: AppColors.primary,
//             ),
//             maxLines: 1,
//             overflow: TextOverflow.ellipsis,
//           ),
//           Text(
//             label,
//             style: AppTextStyles.labelSM.copyWith(fontWeight: FontWeight.w400),
//           ),
//         ],
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 17. SUBSCRIPTION SCREEN
// // ===========================================================================

// class SubscriptionScreen extends StatelessWidget {
//   const SubscriptionScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(title: 'GymKey', showBack: true, actions: []),
//       body: FutureBuilder<List<SubscriptionPlan>>(
//         future: const ApiService().getPlans(),
//         builder: (context, snapshot) {
//           if (snapshot.connectionState == ConnectionState.waiting)
//             return const Center(
//               child: CircularProgressIndicator(color: AppColors.secondary),
//             );
//           if (snapshot.hasError ||
//               !snapshot.hasData ||
//               snapshot.data!.isEmpty) {
//             return Center(
//               child: Text(
//                 'Unable to load plans.',
//                 style: AppTextStyles.bodyMD.copyWith(
//                   color: AppColors.onSurfaceVariant,
//                 ),
//               ),
//             );
//           }
//           final plans = snapshot.data!;
//           return ListView(
//             padding: const EdgeInsets.fromLTRB(20, 20, 20, 60),
//             children: [
//               Text(
//                 'Elevate Your Training',
//                 style: AppTextStyles.headlineXL,
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 8),
//               Text(
//                 'Select the plan that fits your high-performance lifestyle.',
//                 style: AppTextStyles.bodyMD.copyWith(
//                   color: AppColors.onSurfaceVariant,
//                 ),
//                 textAlign: TextAlign.center,
//               ),
//               const SizedBox(height: 28),
//               ...plans.map((plan) => _PlanCard(plan: plan)),
//             ],
//           );
//         },
//       ),
//     );
//   }
// }

// class _PlanCard extends StatelessWidget {
//   final SubscriptionPlan plan;
//   const _PlanCard({required this.plan});

//   void _handlePayment(BuildContext context) async {
//     final storage = const FlutterSecureStorage();
//     final token = await storage.read(key: "jwt_token");
//     if (token == null) {
//       ScaffoldMessenger.of(
//         context,
//       ).showSnackBar(const SnackBar(content: Text('Please sign in first.')));
//       return;
//     }
//     try {
//       final url = Uri.parse(
//         "https://gymkey-backend-production.up.railway.app/api/subscription/create-session",
//       );
//       final response = await http.post(
//         url,
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": "Bearer $token",
//         },
//         body: convert.jsonEncode({"priceId": plan.id}),
//       );
//       final data = convert.jsonDecode(response.body);
//       if (response.statusCode == 200 && data["url"] != null) {
//         Navigator.push(
//           context,
//           MaterialPageRoute(builder: (_) => CheckoutWebView(url: data["url"])),
//         );
//       } else {
//         throw Exception(data["message"] ?? "Payment failed.");
//       }
//     } catch (e) {
//       ScaffoldMessenger.of(context).showSnackBar(
//         SnackBar(
//           content: Text(
//             'Payment Error: ${e.toString().replaceAll('Exception: ', '')}',
//           ),
//           backgroundColor: AppColors.error,
//           behavior: SnackBarBehavior.floating,
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(12),
//           ),
//         ),
//       );
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     final color = _planTierColor(plan.accessTier);
//     final isFeatured = plan.accessTier == 2;

//     return Padding(
//       padding: const EdgeInsets.only(bottom: 16),
//       child: Container(
//         decoration: BoxDecoration(
//           color: isFeatured
//               ? AppColors.primaryContainer
//               : AppColors.surfaceContainerLowest,
//           borderRadius: BorderRadius.circular(20),
//           border: Border.all(
//             color: isFeatured ? AppColors.secondary : AppColors.outlineVariant,
//             width: isFeatured ? 2 : 1,
//           ),
//           boxShadow: [
//             BoxShadow(
//               color: isFeatured
//                   ? AppColors.primaryContainer.withOpacity(0.3)
//                   : const Color(0x0C2C1A0E),
//               blurRadius: 20,
//               offset: const Offset(0, 6),
//             ),
//           ],
//         ),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             if (isFeatured)
//               Container(
//                 width: double.infinity,
//                 padding: const EdgeInsets.symmetric(vertical: 8),
//                 decoration: const BoxDecoration(
//                   color: AppColors.secondary,
//                   borderRadius: BorderRadius.only(
//                     topLeft: Radius.circular(18),
//                     topRight: Radius.circular(18),
//                   ),
//                 ),
//                 alignment: Alignment.center,
//                 child: const Text(
//                   'BEST VALUE',
//                   style: TextStyle(
//                     fontFamily: 'Inter',
//                     color: Colors.white,
//                     fontSize: 12,
//                     fontWeight: FontWeight.w700,
//                     letterSpacing: 1.5,
//                   ),
//                 ),
//               ),
//             Padding(
//               padding: const EdgeInsets.all(20),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     plan.name.toUpperCase(),
//                     style: AppTextStyles.labelSM.copyWith(
//                       color: isFeatured
//                           ? AppColors.onPrimaryContainer
//                           : AppColors.onSurfaceVariant,
//                       letterSpacing: 1.5,
//                     ),
//                   ),
//                   const SizedBox(height: 6),
//                   Row(
//                     crossAxisAlignment: CrossAxisAlignment.end,
//                     children: [
//                       Text(
//                         'Rs. ${plan.price}',
//                         style: AppTextStyles.headlineXL.copyWith(
//                           color: isFeatured ? Colors.white : AppColors.primary,
//                         ),
//                       ),
//                       Padding(
//                         padding: const EdgeInsets.only(bottom: 4, left: 6),
//                         child: Text(
//                           '/ ${plan.interval}',
//                           style: AppTextStyles.bodyMD.copyWith(
//                             color: isFeatured
//                                 ? Colors.white60
//                                 : AppColors.onSurfaceVariant,
//                           ),
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 8),
//                   if (plan.description.isNotEmpty)
//                     Text(
//                       plan.description,
//                       style: AppTextStyles.bodyMD.copyWith(
//                         color: isFeatured
//                             ? Colors.white70
//                             : AppColors.onSurfaceVariant,
//                       ),
//                     ),
//                   const SizedBox(height: 14),
//                   ...plan.features.map(
//                     (f) => Padding(
//                       padding: const EdgeInsets.only(bottom: 8),
//                       child: Row(
//                         children: [
//                           Icon(
//                             Icons.check_circle_rounded,
//                             size: 16,
//                             color: isFeatured
//                                 ? AppColors.secondaryContainer
//                                 : color,
//                           ),
//                           const SizedBox(width: 10),
//                           Expanded(
//                             child: Text(
//                               f,
//                               style: AppTextStyles.bodyMD.copyWith(
//                                 color: isFeatured
//                                     ? Colors.white
//                                     : AppColors.onSurface,
//                               ),
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                   const SizedBox(height: 16),
//                   SizedBox(
//                     width: double.infinity,
//                     height: 52,
//                     child: ElevatedButton(
//                       onPressed: () => _handlePayment(context),
//                       style: ElevatedButton.styleFrom(
//                         backgroundColor: isFeatured
//                             ? AppColors.secondary
//                             : AppColors.primaryContainer,
//                         foregroundColor: Colors.white,
//                         shape: const StadiumBorder(),
//                         elevation: 0,
//                       ),
//                       child: Text(
//                         'Subscribe — Rs. ${plan.price}',
//                         style: const TextStyle(
//                           fontFamily: 'Inter',
//                           fontWeight: FontWeight.w700,
//                           fontSize: 15,
//                         ),
//                       ),
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 18. CHECKOUT WEBVIEW
// // ===========================================================================

// class CheckoutWebView extends StatefulWidget {
//   final String url;
//   const CheckoutWebView({super.key, required this.url});

//   @override
//   State<CheckoutWebView> createState() => _CheckoutWebViewState();
// }

// class _CheckoutWebViewState extends State<CheckoutWebView> {
//   bool _loading = true;
//   late WebViewController _controller;
//   static const successBaseUrl =
//       "https://gymkey-backend-production.up.railway.app/subscription/success";

//   @override
//   void initState() {
//     super.initState();
//     _controller = WebViewController()
//       ..setJavaScriptMode(JavaScriptMode.unrestricted)
//       ..setNavigationDelegate(
//         NavigationDelegate(
//           onPageFinished: (url) {
//             setState(() => _loading = false);
//             if (url.startsWith(successBaseUrl)) _handleSuccess();
//           },
//         ),
//       )
//       ..loadRequest(Uri.parse(widget.url));
//   }

//   Future<void> _handleSuccess() async {
//     Navigator.pop(context);
//     await Future.delayed(const Duration(milliseconds: 300));
//     const storage = FlutterSecureStorage();
//     final token = await storage.read(key: "jwt_token");
//     if (token == null) return;
//     try {
//       final response = await http.get(
//         Uri.parse(
//           "https://gymkey-backend-production.up.railway.app/subscription/status",
//         ),
//         headers: {"Authorization": "Bearer $token"},
//       );
//       final data = convert.jsonDecode(response.body);
//       if (data["hasActiveSubscription"] == true && mounted) {
//         ScaffoldMessenger.of(context).showSnackBar(
//           SnackBar(content: Text("Subscription Activated ✔ (${data['plan']})")),
//         );
//         Navigator.pop(context, true);
//       }
//     } catch (e) {
//       debugPrint("Subscription check error: $e");
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(
//         backgroundColor: AppColors.primaryContainer,
//         leading: IconButton(
//           icon: const Icon(Icons.close, color: Colors.white),
//           onPressed: () => Navigator.pop(context),
//         ),
//         title: const Text(
//           'Processing Payment',
//           style: TextStyle(
//             fontFamily: 'Inter',
//             color: Colors.white,
//             fontWeight: FontWeight.w600,
//           ),
//         ),
//         actions: const [
//           Padding(
//             padding: EdgeInsets.only(right: 16),
//             child: Icon(Icons.lock, color: Colors.white70, size: 18),
//           ),
//         ],
//       ),
//       body: Stack(
//         children: [
//           WebViewWidget(controller: _controller),
//           if (_loading)
//             Container(
//               color: AppColors.background,
//               child: const Center(
//                 child: CircularProgressIndicator(color: AppColors.secondary),
//               ),
//             ),
//         ],
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 19. NOTIFICATIONS SCREEN (New — Placeholder with full UI)
// // ===========================================================================

// class NotificationsScreen extends StatelessWidget {
//   const NotificationsScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final notifications = [
//       _NotifData(
//         icon: Icons.fitness_center,
//         title: 'Class Starting Soon',
//         body:
//             'Your "Advanced Power Yoga" session starts in 30 minutes. Don\'t forget your mat!',
//         time: '12m ago',
//         isUnread: true,
//       ),
//       _NotifData(
//         icon: Icons.workspace_premium,
//         title: 'Subscription Renewed',
//         body:
//             'Your Premium plan has been successfully renewed for another month.',
//         time: '2h ago',
//         isUnread: true,
//       ),
//       _NotifData(
//         icon: Icons.local_offer_outlined,
//         title: 'New Studio Added',
//         body:
//             'Iron & Ember Studio is now available in your area. Check it out!',
//         time: '1d ago',
//         isUnread: false,
//       ),
//       _NotifData(
//         icon: Icons.bolt,
//         title: '7-Day Streak!',
//         body:
//             'Incredible — you\'ve maintained a 7-day workout streak. Keep going!',
//         time: '2d ago',
//         isUnread: false,
//       ),
//     ];

//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(
//         title: 'GymKey',
//         showBack: true,
//         actions: [
//           Padding(
//             padding: const EdgeInsets.only(right: 16),
//             child: Icon(Icons.tune, color: AppColors.onPrimary),
//           ),
//         ],
//       ),
//       body: ListView(
//         padding: const EdgeInsets.fromLTRB(20, 20, 20, 60),
//         children: [
//           Row(
//             mainAxisAlignment: MainAxisAlignment.spaceBetween,
//             children: [
//               Text('Notifications', style: AppTextStyles.headlineXL),
//               TextButton(
//                 onPressed: () {},
//                 child: Text(
//                   'Mark all read',
//                   style: AppTextStyles.labelMD.copyWith(
//                     color: AppColors.secondary,
//                   ),
//                 ),
//               ),
//             ],
//           ),
//           const SizedBox(height: 4),
//           Text('Today', style: AppTextStyles.headlineMD.copyWith(fontSize: 16)),
//           const SizedBox(height: 12),
//           ...notifications.take(2).map((n) => _NotifCard(notif: n)),
//           const SizedBox(height: 16),
//           Text(
//             'Earlier',
//             style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
//           ),
//           const SizedBox(height: 12),
//           ...notifications.skip(2).map((n) => _NotifCard(notif: n)),
//         ],
//       ),
//     );
//   }
// }

// class _NotifData {
//   final IconData icon;
//   final String title;
//   final String body;
//   final String time;
//   final bool isUnread;
//   const _NotifData({
//     required this.icon,
//     required this.title,
//     required this.body,
//     required this.time,
//     required this.isUnread,
//   });
// }

// class _NotifCard extends StatelessWidget {
//   final _NotifData notif;
//   const _NotifCard({required this.notif});

//   @override
//   Widget build(BuildContext context) {
//     return Padding(
//       padding: const EdgeInsets.only(bottom: 10),
//       child: Container(
//         decoration: BoxDecoration(
//           color: AppColors.surfaceContainerLowest,
//           borderRadius: BorderRadius.circular(14),
//           border: notif.isUnread
//               ? const Border(
//                   left: BorderSide(color: AppColors.secondary, width: 3),
//                 )
//               : Border.all(color: AppColors.outlineVariant),
//           boxShadow: const [
//             BoxShadow(
//               color: Color(0x082C1A0E),
//               blurRadius: 16,
//               offset: Offset(0, 4),
//             ),
//           ],
//         ),
//         child: Padding(
//           padding: const EdgeInsets.all(14),
//           child: Row(
//             crossAxisAlignment: CrossAxisAlignment.start,
//             children: [
//               Container(
//                 width: 44,
//                 height: 44,
//                 decoration: BoxDecoration(
//                   color: AppColors.secondaryContainer,
//                   shape: BoxShape.circle,
//                 ),
//                 child: Icon(
//                   notif.icon,
//                   color: AppColors.onSecondaryContainer,
//                   size: 22,
//                 ),
//               ),
//               const SizedBox(width: 14),
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Row(
//                       mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                       children: [
//                         Expanded(
//                           child: Text(
//                             notif.title,
//                             style: AppTextStyles.labelMD.copyWith(
//                               fontWeight: FontWeight.w700,
//                               color: AppColors.primary,
//                             ),
//                           ),
//                         ),
//                         Text(
//                           notif.time,
//                           style: AppTextStyles.labelSM.copyWith(
//                             fontWeight: FontWeight.w400,
//                             color: AppColors.outline,
//                           ),
//                         ),
//                       ],
//                     ),
//                     const SizedBox(height: 4),
//                     Text(
//                       notif.body,
//                       style: AppTextStyles.bodyMD.copyWith(
//                         fontSize: 14,
//                         color: AppColors.onSurfaceVariant,
//                         height: 1.4,
//                       ),
//                     ),
//                     if (notif.isUnread)
//                       Padding(
//                         padding: const EdgeInsets.only(top: 8),
//                         child: Container(
//                           padding: const EdgeInsets.symmetric(
//                             horizontal: 10,
//                             vertical: 3,
//                           ),
//                           decoration: BoxDecoration(
//                             color: AppColors.secondaryContainer,
//                             borderRadius: BorderRadius.circular(99),
//                           ),
//                           child: Text(
//                             'New',
//                             style: AppTextStyles.labelSM.copyWith(
//                               color: AppColors.onSecondaryContainer,
//                               fontSize: 10,
//                               fontWeight: FontWeight.w800,
//                             ),
//                           ),
//                         ),
//                       ),
//                   ],
//                 ),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 20. CHECK-IN HISTORY SCREEN (New — Placeholder with full UI)
// // ===========================================================================

// class CheckInHistoryScreen extends StatelessWidget {
//   const CheckInHistoryScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final history = [
//       _HistoryItem(
//         name: 'Iron & Ember Studio',
//         date: 'Today, 7:30 AM',
//         duration: '65 min',
//         type: 'Strength',
//       ),
//       _HistoryItem(
//         name: 'Lotus Yoga Collective',
//         date: 'Yesterday, 9:00 AM',
//         duration: '50 min',
//         type: 'Yoga',
//       ),
//       _HistoryItem(
//         name: 'Peak Performance Gym',
//         date: 'Mon, May 13, 6:15 AM',
//         duration: '75 min',
//         type: 'HIIT',
//       ),
//       _HistoryItem(
//         name: 'Iron & Ember Studio',
//         date: 'Sat, May 11, 8:00 AM',
//         duration: '60 min',
//         type: 'Strength',
//       ),
//       _HistoryItem(
//         name: 'Velocity Box Club',
//         date: 'Fri, May 10, 7:45 AM',
//         duration: '45 min',
//         type: 'Boxing',
//       ),
//     ];
//     final filters = [
//       'All Visits',
//       'Yoga',
//       'Boxing',
//       'Spin',
//       'HIIT',
//       'Strength',
//     ];

//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(title: 'GymKey', showBack: true, actions: []),
//       body: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Padding(
//             padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text('History', style: AppTextStyles.headlineXL),
//                 const SizedBox(height: 4),
//                 Text(
//                   'Your recent check-ins and studio visits.',
//                   style: AppTextStyles.bodyMD.copyWith(
//                     color: AppColors.onSurfaceVariant,
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//                 SizedBox(
//                   height: 36,
//                   child: ListView.separated(
//                     scrollDirection: Axis.horizontal,
//                     itemCount: filters.length,
//                     separatorBuilder: (_, __) => const SizedBox(width: 8),
//                     itemBuilder: (context, i) {
//                       final isSelected = i == 0;
//                       return Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: 16,
//                           vertical: 8,
//                         ),
//                         decoration: BoxDecoration(
//                           color: isSelected
//                               ? AppColors.primaryContainer
//                               : AppColors.surfaceContainerHigh,
//                           borderRadius: BorderRadius.circular(99),
//                           border: isSelected
//                               ? null
//                               : Border.all(color: AppColors.outlineVariant),
//                         ),
//                         child: Text(
//                           filters[i],
//                           style: AppTextStyles.labelMD.copyWith(
//                             color: isSelected
//                                 ? Colors.white
//                                 : AppColors.onSurfaceVariant,
//                             fontSize: 13,
//                           ),
//                         ),
//                       );
//                     },
//                   ),
//                 ),
//                 const SizedBox(height: 16),
//               ],
//             ),
//           ),
//           Expanded(
//             child: ListView.separated(
//               padding: const EdgeInsets.fromLTRB(20, 0, 20, 60),
//               itemCount: history.length,
//               separatorBuilder: (_, __) => const SizedBox(height: 10),
//               itemBuilder: (context, i) => _HistoryCard(item: history[i]),
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// class _HistoryItem {
//   final String name, date, duration, type;
//   const _HistoryItem({
//     required this.name,
//     required this.date,
//     required this.duration,
//     required this.type,
//   });
// }

// class _HistoryCard extends StatelessWidget {
//   final _HistoryItem item;
//   const _HistoryCard({required this.item});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       decoration: luxuryCardDecoration.copyWith(
//         border: Border(
//           left: const BorderSide(color: AppColors.secondary, width: 3),
//           top: BorderSide(color: AppColors.surfaceContainer),
//           right: BorderSide(color: AppColors.surfaceContainer),
//           bottom: BorderSide(color: AppColors.surfaceContainer),
//         ),
//       ),
//       padding: const EdgeInsets.all(16),
//       child: Row(
//         children: [
//           Container(
//             width: 48,
//             height: 48,
//             decoration: BoxDecoration(
//               color: AppColors.secondaryContainer.withOpacity(0.5),
//               borderRadius: BorderRadius.circular(12),
//             ),
//             child: const Icon(
//               Icons.fitness_center,
//               color: AppColors.secondary,
//               size: 24,
//             ),
//           ),
//           const SizedBox(width: 14),
//           Expanded(
//             child: Column(
//               crossAxisAlignment: CrossAxisAlignment.start,
//               children: [
//                 Text(
//                   item.name,
//                   style: AppTextStyles.labelMD.copyWith(
//                     fontWeight: FontWeight.w700,
//                     color: AppColors.primary,
//                   ),
//                 ),
//                 const SizedBox(height: 3),
//                 Text(
//                   item.date,
//                   style: AppTextStyles.labelSM.copyWith(
//                     fontWeight: FontWeight.w400,
//                     color: AppColors.onSurfaceVariant,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//           Column(
//             crossAxisAlignment: CrossAxisAlignment.end,
//             children: [
//               Container(
//                 padding: const EdgeInsets.symmetric(
//                   horizontal: 10,
//                   vertical: 4,
//                 ),
//                 decoration: BoxDecoration(
//                   color: AppColors.secondaryContainer,
//                   borderRadius: BorderRadius.circular(99),
//                 ),
//                 child: Text(
//                   item.type,
//                   style: AppTextStyles.labelSM.copyWith(
//                     color: AppColors.onSecondaryContainer,
//                     fontSize: 11,
//                   ),
//                 ),
//               ),
//               const SizedBox(height: 4),
//               Text(
//                 item.duration,
//                 style: AppTextStyles.labelSM.copyWith(
//                   color: AppColors.outline,
//                   fontWeight: FontWeight.w600,
//                 ),
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 21. AI FITNESS ONBOARDING (New — Placeholder with full UI)
// // ===========================================================================

// class AIFitnessOnboardingScreen extends StatefulWidget {
//   const AIFitnessOnboardingScreen({super.key});

//   @override
//   State<AIFitnessOnboardingScreen> createState() =>
//       _AIFitnessOnboardingScreenState();
// }

// class _AIFitnessOnboardingScreenState extends State<AIFitnessOnboardingScreen> {
//   int _step = 0;
//   final _goals = [
//     'Weight Loss',
//     'Muscle Gain',
//     'Endurance',
//     'Flexibility',
//     'General Wellness',
//   ];
//   final _selectedGoals = <String>{};

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: AppBar(
//         backgroundColor: AppColors.primaryContainer,
//         leading: IconButton(
//           icon: const Icon(Icons.close, color: Colors.white),
//           onPressed: () => Navigator.pop(context),
//         ),
//         title: const Text(
//           'GymKey',
//           style: TextStyle(
//             fontFamily: 'Inter',
//             color: Colors.white,
//             fontWeight: FontWeight.w600,
//             fontSize: 20,
//           ),
//         ),
//         bottom: PreferredSize(
//           preferredSize: const Size.fromHeight(4),
//           child: Padding(
//             padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
//             child: Row(
//               children: List.generate(
//                 4,
//                 (i) => Expanded(
//                   child: Container(
//                     height: 4,
//                     margin: const EdgeInsets.symmetric(horizontal: 2),
//                     decoration: BoxDecoration(
//                       color: i <= _step
//                           ? AppColors.secondary
//                           : AppColors.surfaceContainerHigh,
//                       borderRadius: BorderRadius.circular(99),
//                     ),
//                   ),
//                 ),
//               ),
//             ),
//           ),
//         ),
//       ),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(24),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             const SizedBox(height: 8),
//             Text('Define Your Journey', style: AppTextStyles.headlineXL),
//             const SizedBox(height: 8),
//             Text(
//               'Tell us about yourself so our AI can curate a precision fitness plan tailored to your body and goals.',
//               style: AppTextStyles.bodyMD.copyWith(
//                 color: AppColors.onSurfaceVariant,
//               ),
//             ),
//             const SizedBox(height: 28),
//             // Metrics row
//             Row(
//               children: [
//                 Expanded(child: _metricField('Age', 'YRS', '28')),
//                 const SizedBox(width: 12),
//                 Expanded(child: _metricField('Height', 'CM', '182')),
//                 const SizedBox(width: 12),
//                 Expanded(child: _metricField('Weight', 'KG', '78')),
//               ],
//             ),
//             const SizedBox(height: 24),
//             Text('Fitness Goals', style: AppTextStyles.headlineMD),
//             const SizedBox(height: 12),
//             Wrap(
//               spacing: 8,
//               runSpacing: 8,
//               children: _goals.map((g) {
//                 final selected = _selectedGoals.contains(g);
//                 return GestureDetector(
//                   onTap: () => setState(
//                     () => selected
//                         ? _selectedGoals.remove(g)
//                         : _selectedGoals.add(g),
//                   ),
//                   child: Container(
//                     padding: const EdgeInsets.symmetric(
//                       horizontal: 16,
//                       vertical: 10,
//                     ),
//                     decoration: BoxDecoration(
//                       color: selected
//                           ? AppColors.primaryContainer
//                           : AppColors.surfaceContainerHigh,
//                       borderRadius: BorderRadius.circular(99),
//                       border: selected
//                           ? null
//                           : Border.all(color: AppColors.outlineVariant),
//                     ),
//                     child: Row(
//                       mainAxisSize: MainAxisSize.min,
//                       children: [
//                         if (selected)
//                           const Icon(
//                             Icons.check,
//                             size: 14,
//                             color: Colors.white,
//                           ),
//                         if (selected) const SizedBox(width: 6),
//                         Text(
//                           g,
//                           style: AppTextStyles.labelMD.copyWith(
//                             color: selected
//                                 ? Colors.white
//                                 : AppColors.onSurfaceVariant,
//                           ),
//                         ),
//                       ],
//                     ),
//                   ),
//                 );
//               }).toList(),
//             ),
//             const SizedBox(height: 32),
//             // Fitness level
//             Text('Fitness Level', style: AppTextStyles.headlineMD),
//             const SizedBox(height: 12),
//             ...['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(
//               (level) => Padding(
//                 padding: const EdgeInsets.only(bottom: 8),
//                 child: Container(
//                   padding: const EdgeInsets.all(16),
//                   decoration: BoxDecoration(
//                     color: AppColors.surfaceContainerLow,
//                     borderRadius: BorderRadius.circular(12),
//                     border: Border.all(color: AppColors.outlineVariant),
//                   ),
//                   child: Row(
//                     children: [
//                       Radio<String>(
//                         value: level,
//                         groupValue: 'Intermediate',
//                         onChanged: (_) {},
//                         activeColor: AppColors.secondary,
//                       ),
//                       Text(
//                         level,
//                         style: AppTextStyles.bodyMD.copyWith(
//                           fontWeight: FontWeight.w500,
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),
//             const SizedBox(height: 32),
//             SizedBox(
//               width: double.infinity,
//               height: 56,
//               child: ElevatedButton(
//                 onPressed: () => Navigator.pushReplacementNamed(
//                   context,
//                   AppRoutes.aiWorkout,
//                 ),
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: AppColors.primaryContainer,
//                   foregroundColor: Colors.white,
//                   shape: const StadiumBorder(),
//                 ),
//                 child: const Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     Icon(Icons.auto_awesome, color: Colors.white),
//                     SizedBox(width: 8),
//                     Text(
//                       'Generate My AI Plan',
//                       style: TextStyle(
//                         fontFamily: 'Inter',
//                         fontWeight: FontWeight.w700,
//                         fontSize: 16,
//                       ),
//                     ),
//                   ],
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _metricField(String label, String unit, String placeholder) {
//     return Column(
//       crossAxisAlignment: CrossAxisAlignment.start,
//       children: [
//         Text(
//           label,
//           style: AppTextStyles.labelMD.copyWith(
//             color: AppColors.onSurfaceVariant,
//           ),
//         ),
//         const SizedBox(height: 6),
//         TextField(
//           keyboardType: TextInputType.number,
//           decoration: InputDecoration(
//             hintText: placeholder,
//             suffixText: unit,
//             suffixStyle: AppTextStyles.labelSM.copyWith(
//               color: AppColors.outline,
//             ),
//             contentPadding: const EdgeInsets.symmetric(
//               horizontal: 12,
//               vertical: 14,
//             ),
//           ),
//         ),
//       ],
//     );
//   }
// }

// // ===========================================================================
// // 22. AI WORKOUT SCREEN (New — Placeholder with full UI)
// // ===========================================================================

// class AIWorkoutScreen extends StatelessWidget {
//   const AIWorkoutScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     final workouts = [
//       _WorkoutData(
//         'Mobility Recovery',
//         '35 min • Low intensity',
//         'Today\'s Pick',
//       ),
//       _WorkoutData(
//         'Upper Body Strength',
//         '50 min • High intensity',
//         'Tomorrow',
//       ),
//       _WorkoutData('Zone 2 Cardio', '45 min • Moderate', 'Day 3'),
//     ];

//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: const GymKeyAppBar(title: 'GymKey', showMenu: true),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(20),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // AI Banner
//             Container(
//               padding: const EdgeInsets.all(20),
//               decoration: BoxDecoration(
//                 color: AppColors.surfaceContainerLow,
//                 borderRadius: BorderRadius.circular(16),
//                 border: Border.all(
//                   color: AppColors.secondaryContainer.withOpacity(0.5),
//                 ),
//               ),
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Row(
//                     children: [
//                       const Icon(
//                         Icons.auto_awesome,
//                         color: AppColors.secondary,
//                         size: 18,
//                       ),
//                       const SizedBox(width: 8),
//                       Text(
//                         'AI INSIGHTS',
//                         style: AppTextStyles.labelSM.copyWith(
//                           color: AppColors.secondary,
//                           letterSpacing: 1.5,
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 8),
//                   Text(
//                     'Tailored for your Peak',
//                     style: AppTextStyles.headlineLG,
//                   ),
//                   const SizedBox(height: 6),
//                   Text(
//                     'Based on your sleep quality (84%) and yesterday\'s high-intensity session, we recommend a focused mobility recovery.',
//                     style: AppTextStyles.bodyMD.copyWith(
//                       color: AppColors.onSurfaceVariant,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//             const SizedBox(height: 24),
//             Text('Daily Picks', style: AppTextStyles.headlineMD),
//             const SizedBox(height: 12),
//             ...workouts.map(
//               (w) => Padding(
//                 padding: const EdgeInsets.only(bottom: 12),
//                 child: Container(
//                   decoration: luxuryCardDecoration,
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: [
//                       Container(
//                         height: 120,
//                         decoration: const BoxDecoration(
//                           borderRadius: BorderRadius.only(
//                             topLeft: Radius.circular(16),
//                             topRight: Radius.circular(16),
//                           ),
//                           image: DecorationImage(
//                             image: NetworkImage(
//                               'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
//                             ),
//                             fit: BoxFit.cover,
//                             colorFilter: ColorFilter.mode(
//                               Color(0x552C1A0E),
//                               BlendMode.darken,
//                             ),
//                           ),
//                         ),
//                       ),
//                       Padding(
//                         padding: const EdgeInsets.all(16),
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               w.label,
//                               style: AppTextStyles.labelSM.copyWith(
//                                 color: AppColors.secondary,
//                                 letterSpacing: 1.2,
//                               ),
//                             ),
//                             const SizedBox(height: 4),
//                             Text(
//                               w.title,
//                               style: AppTextStyles.headlineMD.copyWith(
//                                 fontSize: 18,
//                               ),
//                             ),
//                             const SizedBox(height: 2),
//                             Text(
//                               w.duration,
//                               style: AppTextStyles.bodyMD.copyWith(
//                                 color: AppColors.onSurfaceVariant,
//                                 fontSize: 14,
//                               ),
//                             ),
//                             const SizedBox(height: 12),
//                             SizedBox(
//                               width: double.infinity,
//                               height: 44,
//                               child: ElevatedButton(
//                                 onPressed: () {},
//                                 style: ElevatedButton.styleFrom(
//                                   backgroundColor: AppColors.primaryContainer,
//                                   foregroundColor: Colors.white,
//                                   shape: const StadiumBorder(),
//                                 ),
//                                 child: const Text(
//                                   'Start Workout',
//                                   style: TextStyle(
//                                     fontFamily: 'Inter',
//                                     fontWeight: FontWeight.w600,
//                                   ),
//                                 ),
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

// class _WorkoutData {
//   final String title, duration, label;
//   const _WorkoutData(this.title, this.duration, this.label);
// }

// // ===========================================================================
// // 23. NUTRITION SCREEN (New — Placeholder with full UI)
// // ===========================================================================

// class NutritionScreen extends StatelessWidget {
//   const NutritionScreen({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: const GymKeyAppBar(title: 'GymKey', showMenu: true),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(20),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             Text('Nutrition', style: AppTextStyles.headlineXL),
//             const SizedBox(height: 4),
//             Text(
//               'Track your daily intake and macros.',
//               style: AppTextStyles.bodyMD.copyWith(
//                 color: AppColors.onSurfaceVariant,
//               ),
//             ),
//             const SizedBox(height: 24),

//             // Calorie ring card
//             Container(
//               decoration: luxuryCardDecoration,
//               padding: const EdgeInsets.all(24),
//               child: Column(
//                 children: [
//                   // Ring placeholder
//                   Container(
//                     width: 160,
//                     height: 160,
//                     decoration: BoxDecoration(
//                       shape: BoxShape.circle,
//                       border: Border.all(color: AppColors.secondary, width: 12),
//                     ),
//                     child: Center(
//                       child: Column(
//                         mainAxisSize: MainAxisSize.min,
//                         children: [
//                           Text(
//                             '1,840',
//                             style: AppTextStyles.headlineXL.copyWith(
//                               fontSize: 28,
//                             ),
//                           ),
//                           Text(
//                             'kcal remaining',
//                             style: AppTextStyles.labelSM.copyWith(
//                               fontWeight: FontWeight.w400,
//                               color: AppColors.onSurfaceVariant,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ),
//                   ),
//                   const SizedBox(height: 20),
//                   Row(
//                     mainAxisAlignment: MainAxisAlignment.spaceBetween,
//                     children: [
//                       Column(
//                         crossAxisAlignment: CrossAxisAlignment.start,
//                         children: [
//                           Text(
//                             'Consumed',
//                             style: AppTextStyles.labelSM.copyWith(
//                               color: AppColors.onSurfaceVariant,
//                               fontWeight: FontWeight.w400,
//                             ),
//                           ),
//                           Text(
//                             '660 kcal',
//                             style: AppTextStyles.headlineMD.copyWith(
//                               fontSize: 18,
//                             ),
//                           ),
//                         ],
//                       ),
//                       Column(
//                         crossAxisAlignment: CrossAxisAlignment.end,
//                         children: [
//                           Text(
//                             'Burned',
//                             style: AppTextStyles.labelSM.copyWith(
//                               color: AppColors.onSurfaceVariant,
//                               fontWeight: FontWeight.w400,
//                             ),
//                           ),
//                           Text(
//                             '320 kcal',
//                             style: AppTextStyles.headlineMD.copyWith(
//                               color: AppColors.secondary,
//                               fontSize: 18,
//                             ),
//                           ),
//                         ],
//                       ),
//                     ],
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 20),
//             // Macros
//             Row(
//               children: [
//                 Expanded(
//                   child: _macroCard(
//                     'Protein',
//                     '142g',
//                     '200g',
//                     AppColors.secondary,
//                   ),
//                 ),
//                 const SizedBox(width: 10),
//                 Expanded(
//                   child: _macroCard(
//                     'Carbs',
//                     '65g',
//                     '250g',
//                     const Color(0xFF5B8CDB),
//                   ),
//                 ),
//                 const SizedBox(width: 10),
//                 Expanded(
//                   child: _macroCard(
//                     'Fats',
//                     '28g',
//                     '65g',
//                     const Color(0xFFB8862A),
//                   ),
//                 ),
//               ],
//             ),

//             const SizedBox(height: 24),
//             Text('Today\'s Meals', style: AppTextStyles.headlineMD),
//             const SizedBox(height: 12),
//             // Meal placeholder cards
//             ...[
//               ['Breakfast', 'Overnight oats with berries', '420 kcal'],
//               ['Lunch', 'Grilled salmon & quinoa', '540 kcal'],
//               ['Snack', 'Greek yogurt & almonds', '280 kcal'],
//             ].map(
//               (meal) => Padding(
//                 padding: const EdgeInsets.only(bottom: 10),
//                 child: Container(
//                   decoration: luxuryCardDecoration,
//                   padding: const EdgeInsets.all(14),
//                   child: Row(
//                     children: [
//                       Container(
//                         width: 44,
//                         height: 44,
//                         decoration: BoxDecoration(
//                           color: AppColors.surfaceContainerHigh,
//                           borderRadius: BorderRadius.circular(12),
//                         ),
//                         child: const Icon(
//                           Icons.restaurant_menu_outlined,
//                           color: AppColors.secondary,
//                         ),
//                       ),
//                       const SizedBox(width: 14),
//                       Expanded(
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               meal[0],
//                               style: AppTextStyles.labelSM.copyWith(
//                                 color: AppColors.secondary,
//                                 letterSpacing: 1.2,
//                               ),
//                             ),
//                             Text(
//                               meal[1],
//                               style: AppTextStyles.labelMD.copyWith(
//                                 fontWeight: FontWeight.w600,
//                                 color: AppColors.primary,
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                       Text(
//                         meal[2],
//                         style: AppTextStyles.labelMD.copyWith(
//                           color: AppColors.onSurfaceVariant,
//                         ),
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),

//             const SizedBox(height: 20),
//             SizedBox(
//               width: double.infinity,
//               height: 52,
//               child: OutlinedButton.icon(
//                 onPressed: () {},
//                 icon: const Icon(Icons.add, color: AppColors.primaryContainer),
//                 label: const Text(
//                   'Log a Meal',
//                   style: TextStyle(
//                     fontFamily: 'Inter',
//                     fontWeight: FontWeight.w600,
//                     fontSize: 15,
//                     color: AppColors.primaryContainer,
//                   ),
//                 ),
//                 style: OutlinedButton.styleFrom(
//                   side: const BorderSide(
//                     color: AppColors.primaryContainer,
//                     width: 1.5,
//                   ),
//                   shape: const StadiumBorder(),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _macroCard(String name, String current, String goal, Color color) {
//     return Container(
//       padding: const EdgeInsets.all(14),
//       decoration: BoxDecoration(
//         color: AppColors.surfaceContainerLow,
//         borderRadius: BorderRadius.circular(14),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           Text(
//             name,
//             style: AppTextStyles.labelSM.copyWith(
//               color: AppColors.onSurfaceVariant,
//               fontWeight: FontWeight.w400,
//             ),
//           ),
//           const SizedBox(height: 4),
//           Text(
//             current,
//             style: AppTextStyles.headlineMD.copyWith(
//               color: color,
//               fontSize: 18,
//             ),
//           ),
//           const SizedBox(height: 2),
//           Text(
//             'of $goal',
//             style: AppTextStyles.labelSM.copyWith(
//               fontWeight: FontWeight.w400,
//               color: AppColors.outline,
//             ),
//           ),
//         ],
//       ),
//     );
//   }
// }

// // ===========================================================================
// // 24. PAYMENT SCREEN (New — Placeholder with full UI)
// // ===========================================================================

// class PaymentScreen extends StatefulWidget {
//   final SubscriptionPlan plan;
//   const PaymentScreen({required this.plan, super.key});

//   @override
//   State<PaymentScreen> createState() => _PaymentScreenState();
// }

// class _PaymentScreenState extends State<PaymentScreen> {
//   String _selectedMethod = 'card';

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       backgroundColor: AppColors.background,
//       appBar: GymKeyAppBar(
//         title: 'GymKey',
//         showBack: true,
//         actions: const [
//           Padding(
//             padding: EdgeInsets.only(right: 16),
//             child: Row(
//               children: [
//                 Icon(Icons.lock, color: Colors.white70, size: 16),
//                 SizedBox(width: 4),
//                 Text(
//                   'SECURE',
//                   style: TextStyle(
//                     fontFamily: 'Inter',
//                     color: Colors.white70,
//                     fontSize: 11,
//                     letterSpacing: 1.5,
//                   ),
//                 ),
//               ],
//             ),
//           ),
//         ],
//       ),
//       body: SingleChildScrollView(
//         padding: const EdgeInsets.all(20),
//         child: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: [
//             // Order Summary
//             Text('Order Summary', style: AppTextStyles.headlineMD),
//             const SizedBox(height: 12),
//             Container(
//               decoration: luxuryCardDecoration,
//               padding: const EdgeInsets.all(20),
//               child: Column(
//                 children: [
//                   Row(
//                     children: [
//                       Container(
//                         width: 56,
//                         height: 56,
//                         decoration: BoxDecoration(
//                           color: AppColors.surfaceContainerHigh,
//                           borderRadius: BorderRadius.circular(10),
//                         ),
//                         child: const Icon(
//                           Icons.fitness_center,
//                           color: AppColors.secondary,
//                           size: 28,
//                         ),
//                       ),
//                       const SizedBox(width: 14),
//                       Expanded(
//                         child: Column(
//                           crossAxisAlignment: CrossAxisAlignment.start,
//                           children: [
//                             Text(
//                               widget.plan.name,
//                               style: AppTextStyles.labelMD.copyWith(
//                                 fontWeight: FontWeight.w700,
//                                 color: AppColors.primary,
//                               ),
//                             ),
//                             Text(
//                               '${widget.plan.interval} access',
//                               style: AppTextStyles.labelSM.copyWith(
//                                 fontWeight: FontWeight.w400,
//                                 color: AppColors.onSurfaceVariant,
//                               ),
//                             ),
//                           ],
//                         ),
//                       ),
//                       Text(
//                         'Rs. ${widget.plan.price}',
//                         style: AppTextStyles.headlineMD.copyWith(
//                           color: AppColors.secondary,
//                         ),
//                       ),
//                     ],
//                   ),
//                   const SizedBox(height: 16),
//                   Divider(color: AppColors.outlineVariant),
//                   const SizedBox(height: 12),
//                   _summaryRow('Subtotal', 'Rs. ${widget.plan.price}'),
//                   _summaryRow('Tax', 'Rs. 0'),
//                   const SizedBox(height: 8),
//                   _summaryRow(
//                     'Total',
//                     'Rs. ${widget.plan.price}',
//                     isBold: true,
//                   ),
//                 ],
//               ),
//             ),

//             const SizedBox(height: 24),
//             Text(
//               'Payment Method',
//               style: AppTextStyles.labelSM.copyWith(
//                 letterSpacing: 1.5,
//                 color: AppColors.onSurfaceVariant,
//               ),
//             ),
//             const SizedBox(height: 12),
//             Row(
//               children: [
//                 Expanded(
//                   child: _paymentMethod('card', Icons.credit_card, 'Card'),
//                 ),
//                 const SizedBox(width: 12),
//                 Expanded(
//                   child: _paymentMethod(
//                     'wallet',
//                     Icons.account_balance_wallet_outlined,
//                     'Wallet',
//                   ),
//                 ),
//               ],
//             ),

//             const SizedBox(height: 20),
//             // Card fields
//             TextField(
//               decoration: const InputDecoration(
//                 hintText: 'Card Number',
//                 prefixIcon: Icon(Icons.credit_card, color: AppColors.outline),
//               ),
//             ),
//             const SizedBox(height: 12),
//             Row(
//               children: [
//                 Expanded(
//                   child: TextField(
//                     decoration: const InputDecoration(hintText: 'MM / YY'),
//                   ),
//                 ),
//                 const SizedBox(width: 12),
//                 Expanded(
//                   child: TextField(
//                     decoration: const InputDecoration(
//                       hintText: 'CVV',
//                       prefixIcon: Icon(
//                         Icons.lock_outline,
//                         color: AppColors.outline,
//                       ),
//                     ),
//                   ),
//                 ),
//               ],
//             ),
//             const SizedBox(height: 12),
//             TextField(
//               decoration: const InputDecoration(
//                 hintText: 'Cardholder Name',
//                 prefixIcon: Icon(
//                   Icons.person_outline,
//                   color: AppColors.outline,
//                 ),
//               ),
//             ),

//             const SizedBox(height: 32),
//             SizedBox(
//               width: double.infinity,
//               height: 56,
//               child: ElevatedButton(
//                 onPressed: () => Navigator.pop(context),
//                 style: ElevatedButton.styleFrom(
//                   backgroundColor: AppColors.primaryContainer,
//                   foregroundColor: Colors.white,
//                   shape: const StadiumBorder(),
//                 ),
//                 child: Text(
//                   'Pay Rs. ${widget.plan.price}',
//                   style: const TextStyle(
//                     fontFamily: 'Inter',
//                     fontWeight: FontWeight.w700,
//                     fontSize: 16,
//                   ),
//                 ),
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   Widget _summaryRow(String label, String value, {bool isBold = false}) {
//     return Padding(
//       padding: const EdgeInsets.symmetric(vertical: 3),
//       child: Row(
//         mainAxisAlignment: MainAxisAlignment.spaceBetween,
//         children: [
//           Text(
//             label,
//             style: isBold
//                 ? AppTextStyles.headlineMD.copyWith(fontSize: 16)
//                 : AppTextStyles.bodyMD.copyWith(
//                     color: AppColors.onSurfaceVariant,
//                   ),
//           ),
//           Text(
//             value,
//             style: isBold
//                 ? AppTextStyles.headlineMD.copyWith(
//                     color: AppColors.primary,
//                     fontSize: 16,
//                   )
//                 : AppTextStyles.bodyMD.copyWith(
//                     color: AppColors.onSurfaceVariant,
//                   ),
//           ),
//         ],
//       ),
//     );
//   }

//   Widget _paymentMethod(String id, IconData icon, String label) {
//     final selected = _selectedMethod == id;
//     return GestureDetector(
//       onTap: () => setState(() => _selectedMethod = id),
//       child: Container(
//         padding: const EdgeInsets.all(14),
//         decoration: BoxDecoration(
//           color: selected
//               ? AppColors.primaryContainer.withOpacity(0.08)
//               : AppColors.surfaceContainerLow,
//           borderRadius: BorderRadius.circular(12),
//           border: Border.all(
//             color: selected
//                 ? AppColors.primaryContainer
//                 : AppColors.outlineVariant,
//             width: selected ? 2 : 1,
//           ),
//         ),
//         child: Row(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             Icon(
//               icon,
//               color: selected
//                   ? AppColors.primaryContainer
//                   : AppColors.onSurfaceVariant,
//               size: 20,
//             ),
//             const SizedBox(width: 8),
//             Text(
//               label,
//               style: AppTextStyles.labelMD.copyWith(
//                 color: selected
//                     ? AppColors.primaryContainer
//                     : AppColors.onSurfaceVariant,
//                 fontWeight: FontWeight.w600,
//               ),
//             ),
//           ],
//         ),
//       ),
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'dart:async';
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:flutter_map/flutter_map.dart' as fm;
import 'package:latlong2/latlong.dart' as latlng;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:mobile_scanner/mobile_scanner.dart';

// ═══════════════════════════════════════════════════════════════════════════
// BACKEND ALIGNMENT REPORT
// ─────────────────────────────────────────────────────────────────────────
// IMPLEMENTED & ALIGNED:
//   ✅ POST /api/auth/signup           → RegisterScreen
//   ✅ POST /api/auth/login            → LoginScreen
//   ✅ POST /api/auth/verify-otp       → OTPScreen
//   ✅ POST /api/auth/resend-otp       → OTPScreen (resend)
//   ✅ POST /api/auth/forgot-password  → ForgotPasswordScreen step 1
//   ✅ POST /api/auth/reset-password   → ForgotPasswordScreen step 2
//   ✅ GET  /api/auth/me               → AuthManager.loadSession
//   ✅ GET  /api/members/profile       → ProfileScreen (incl. activeSubscription.tier)
//   ✅ GET  /api/gyms                  → HomeScreen, FindGymScreen, CheckInScreen
//   ✅ GET  /api/gyms/:id              → GymDetailScreen
//   ✅ GET  /api/qr/:gymId/qr          → QRScannerScreen (fetches live QR token)
//   ✅ POST /api/checkin               → QRScannerScreen (validates + submits)
//   ✅ GET  /api/subscription/plans    → SubscriptionScreen, HomeScreen
//   ✅ POST /api/subscription/create-session → SubscriptionScreen → CheckoutWebView
//   ✅ GET  /api/subscription/status   → CheckoutWebView success handler
//
// FIXED MISMATCHES vs OLD CODE:
//   🔧 QR flow: Now fetches live token from /api/qr/:gymId/qr (60s expiry JWT)
//      instead of scanning random QR. Correct backend contract.
//   🔧 Check-in payload: gymId comes from QR token (backend validates), not body
//   🔧 Profile: reads activeSubscription.tier.name correctly per Prisma schema
//   🔧 Gym list: accepts both [] and {gyms:[]} response shapes
//   🔧 Subscription: priceId is stripePriceId (from SubscriptionPrice model)
//   🔧 Auth token field: 'token' (not 'access_token')
//   🔧 Forgot-password: two-step flow (send OTP → reset with OTP+new password)
//   🔧 OTP resend: uses /api/auth/resend-otp
//
// PLACEHOLDER (no backend yet — UI + fake service ready to swap):
//   📦 Check-in history → GET /api/members/checkins (not yet implemented)
//   📦 Notifications    → GET /api/members/notifications (not yet implemented)
//   📦 AI Workout/Nutrition → external AI service (not yet implemented)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — DESIGN SYSTEM "Warm Luxury Athleticism"
// ═══════════════════════════════════════════════════════════════════════════

class AppColors {
  // ── Primary Chocolate Truffle ──
  static const Color primary = Color(0xFF0D0300);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color primaryContainer = Color(0xFF2C1A0E);
  static const Color onPrimaryContainer = Color(0xFF9D806F);

  // ── Secondary Caramel (CTAs) ──
  static const Color secondary = Color(0xFF885210);
  static const Color onSecondary = Color(0xFFFFFFFF);
  static const Color secondaryContainer = Color(0xFFFDB56C);
  static const Color onSecondaryContainer = Color(0xFF774401);

  // ── Surface Cream ──
  static const Color surface = Color(0xFFFFF8F0);
  static const Color surfaceContainerLowest = Color(0xFFFFFFFF);
  static const Color surfaceContainerLow = Color(0xFFFAF3E9);
  static const Color surfaceContainer = Color(0xFFF4EDE3);
  static const Color surfaceContainerHigh = Color(0xFFEEE7DD);
  static const Color surfaceContainerHighest = Color(0xFFE8E2D8);
  static const Color onSurface = Color(0xFF1E1B16);
  static const Color onSurfaceVariant = Color(0xFF4F453F);

  // ── Outline ──
  static const Color outline = Color(0xFF81756E);
  static const Color outlineVariant = Color(0xFFD3C4BC);

  // ── Semantic ──
  static const Color error = Color(0xFFBA1A1A);
  static const Color errorContainer = Color(0xFFFFDAD6);
  static const Color success = Color(0xFF16A34A);
  static const Color successContainer = Color(0xFFF0FDF4);
  static const Color warning = Color(0xFFD97706);
  static const Color warningContainer = Color(0xFFFFF7ED);

  // ── Inverse ──
  static const Color inverseSurface = Color(0xFF33302A);
  static const Color inverseOnSurface = Color(0xFFF7F0E6);

  static const Color background = Color(0xFFFFF8F0);
}

class AppTextStyles {
  static const String ff = 'Inter';

  static TextStyle get headlineXL => const TextStyle(
    fontFamily: ff,
    fontSize: 32,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.6,
    height: 1.2,
    color: AppColors.primary,
  );

  static TextStyle get headlineLG => const TextStyle(
    fontFamily: ff,
    fontSize: 24,
    fontWeight: FontWeight.w600,
    letterSpacing: -0.24,
    height: 1.25,
    color: AppColors.primary,
  );

  static TextStyle get headlineMD => const TextStyle(
    fontFamily: ff,
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
    color: AppColors.primary,
  );

  static TextStyle get bodyLG => const TextStyle(
    fontFamily: ff,
    fontSize: 18,
    fontWeight: FontWeight.w400,
    height: 1.55,
    color: AppColors.onSurface,
  );

  static TextStyle get bodyMD => const TextStyle(
    fontFamily: ff,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.onSurface,
  );

  static TextStyle get labelMD => const TextStyle(
    fontFamily: ff,
    fontSize: 14,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.14,
    height: 1.43,
    color: AppColors.onSurface,
  );

  static TextStyle get labelSM => const TextStyle(
    fontFamily: ff,
    fontSize: 12,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.36,
    height: 1.33,
    color: AppColors.onSurfaceVariant,
  );
}

BoxDecoration get luxuryCard => BoxDecoration(
  color: AppColors.surfaceContainerLowest,
  borderRadius: BorderRadius.circular(16),
  border: Border.all(color: AppColors.surfaceContainer),
  boxShadow: const [
    BoxShadow(color: Color(0x142C1A0E), blurRadius: 30, offset: Offset(0, 8)),
  ],
);

Color planTierColor(int tier) {
  switch (tier) {
    case 1:
      return const Color(0xFF5B8CDB);
    case 2:
      return AppColors.secondary;
    case 3:
      return const Color(0xFFB8862A);
    default:
      return AppColors.outline;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 — CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

class AppConfig {
  // Change to your deployed Railway URL in production
  static const String baseUrl = 'http://10.120.12.86:5001/api';
  static const String stripeSuccessBase =
      'https://10.120.12.86:5001/api/subscription/success';
}

class AppRoutes {
  static const splash = '/';
  static const auth = '/auth';
  static const register = '/register';
  static const forgotPassword = '/forgot-password';
  static const home = '/home';
  static const gymDetails = '/gym-details';
  static const subscription = '/subscription';
  static const notifications = '/notifications';
  static const checkInHistory = '/check-in-history';
  static const aiOnboarding = '/ai-onboarding';
  static const aiWorkout = '/ai-workout';
  static const nutrition = '/nutrition';
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 — MODELS (fully aligned with Prisma schema)
// ═══════════════════════════════════════════════════════════════════════════

class UserModel {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? phone;
  final bool isSuspended;
  final String? membershipTier; // from activeSubscription.tier.name
  final int? membershipAccessTier; // from activeSubscription.tier.accessTier
  final DateTime? membershipEndAt; // from activeSubscription.endAt
  final DateTime? createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.role = 'user',
    this.phone,
    this.isSuspended = false,
    this.membershipTier,
    this.membershipAccessTier,
    this.membershipEndAt,
    this.createdAt,
  });

  bool get hasActivePlan => membershipTier != null;

  String get initials => name.isNotEmpty ? name.trim()[0].toUpperCase() : 'U';

  String get formattedJoinDate {
    if (createdAt == null) return 'N/A';
    return '${createdAt!.day.toString().padLeft(2, '0')}-'
        '${createdAt!.month.toString().padLeft(2, '0')}-'
        '${createdAt!.year}';
  }

  factory UserModel.fromJson(Map<String, dynamic> j) {
    String? tierName;
    int? accessTier;
    DateTime? endAt;
    // Backend profile returns: { ...user, activeSubscription: { tier: {...} } }
    final sub = j['activeSubscription'];
    if (sub != null && sub is Map) {
      final tier = sub['tier'];
      if (tier != null && tier is Map) {
        tierName = tier['name']?.toString();
        accessTier = tier['accessTier'] as int?;
      }
      if (sub['endAt'] != null) {
        try {
          endAt = DateTime.parse(sub['endAt'].toString());
        } catch (_) {}
      }
    }
    DateTime? created;
    try {
      if (j['createdAt'] != null)
        created = DateTime.parse(j['createdAt'].toString());
    } catch (_) {}

    return UserModel(
      id: j['id']?.toString() ?? '',
      name: j['name']?.toString() ?? '',
      email: j['email']?.toString() ?? '',
      role: j['role']?.toString() ?? 'user',
      phone: j['phone']?.toString(),
      isSuspended: j['isSuspended'] == true,
      membershipTier: tierName,
      membershipAccessTier: accessTier,
      membershipEndAt: endAt,
      createdAt: created,
    );
  }
}

class GymModel {
  final String id;
  final String name;
  final String description;
  final String address;
  final String city;
  final double latitude;
  final double longitude;
  final double distance;
  final int tier; // gym.tier (Int) from Prisma schema
  final String coverImageUrl;
  final List<String> photos;
  final String? openingTime;
  final String? closingTime;
  final bool is24Hours;
  final String? phoneNumber;
  final String? instagramHandle;
  final String status; // approved | pending | draft | rejected

  GymModel({
    required this.id,
    required this.name,
    this.description = '',
    required this.address,
    required this.city,
    this.latitude = 0.0,
    this.longitude = 0.0,
    this.distance = 0.0,
    this.tier = 1,
    required this.coverImageUrl,
    this.photos = const [],
    this.openingTime,
    this.closingTime,
    this.is24Hours = false,
    this.phoneNumber,
    this.instagramHandle,
    this.status = 'approved',
  });

  String get planLabel {
    switch (tier) {
      case 2:
        return 'Premium';
      case 3:
        return 'Elite';
      default:
        return 'Standard';
    }
  }

  String get hoursDisplay {
    if (is24Hours) return '24 Hours';
    if (openingTime != null && closingTime != null)
      return '$openingTime – $closingTime';
    return 'Mon–Fri: 6AM–10PM';
  }

  static String _resolveImageUrl(dynamic raw) {
    if (raw == null || raw.toString().trim().isEmpty) {
      return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80';
    }
    final s = raw.toString().trim();
    if (s.startsWith('http')) return s;
    // Cloudinary or relative URL
    return '${AppConfig.baseUrl}/images/${s.replaceFirst(RegExp(r'^/'), '')}';
  }

  factory GymModel.fromJson(Map<String, dynamic> j) {
    // Collect photo URLs from photos array
    final photoList = <String>[];
    if (j['photos'] is List) {
      for (final p in (j['photos'] as List)) {
        if (p is Map && p['url'] != null) {
          photoList.add(_resolveImageUrl(p['url']));
        }
      }
    }

    return GymModel(
      id: j['id']?.toString() ?? '',
      name: j['name']?.toString() ?? '',
      description: j['description']?.toString() ?? '',
      address: [
        j['addressLine'],
        j['city'],
      ].where((s) => s != null && s.toString().isNotEmpty).join(', '),
      city: j['city']?.toString() ?? '',
      latitude: (j['latitude'] is num) ? (j['latitude'] as num).toDouble() : 0,
      longitude: (j['longitude'] is num)
          ? (j['longitude'] as num).toDouble()
          : 0,
      distance: (j['distance'] is num) ? (j['distance'] as num).toDouble() : 0,
      tier: (j['tier'] is int) ? j['tier'] as int : 1,
      coverImageUrl: _resolveImageUrl(j['coverImageUrl']),
      photos: photoList,
      openingTime: j['openingTime']?.toString(),
      closingTime: j['closingTime']?.toString(),
      is24Hours: j['is24Hours'] == true,
      phoneNumber: j['phoneNumber']?.toString(),
      instagramHandle: j['instagramHandle']?.toString(),
      status: j['status']?.toString() ?? 'approved',
    );
  }
}

// SubscriptionPrice + SubscriptionTier — aligned with Prisma schema
// Backend /api/subscription/plans returns SubscriptionPrice joined with SubscriptionTier
class SubscriptionPlanModel {
  final String id; // SubscriptionPrice.id
  final String stripePriceId; // used as priceId for checkout session
  final String tierName;
  final String description;
  final int priceCents; // paisa/cents
  final String interval; // monthly | yearly
  final int accessTier;
  final bool isFeatured;
  final List<String> features;

  SubscriptionPlanModel({
    required this.id,
    required this.stripePriceId,
    required this.tierName,
    this.description = '',
    required this.priceCents,
    required this.interval,
    required this.accessTier,
    this.isFeatured = false,
    this.features = const [],
  });

  // Price displayed as whole units (PKR)
  int get displayPrice => (priceCents / 100).round();

  factory SubscriptionPlanModel.fromJson(Map<String, dynamic> j) {
    List<String> feats = [];
    if (j['features'] is List) {
      feats = List<String>.from(
        (j['features'] as List).map((e) => e.toString()),
      );
    }
    // Backend may return flat or nested shape — handle both
    final tierData = j['tier'] as Map<String, dynamic>?;
    return SubscriptionPlanModel(
      id: j['id']?.toString() ?? '',
      stripePriceId:
          j['stripePriceId']?.toString() ?? j['id']?.toString() ?? '',
      tierName: tierData?['name']?.toString() ?? j['name']?.toString() ?? '',
      description:
          tierData?['description']?.toString() ??
          j['description']?.toString() ??
          '',
      // priceCents: (j['priceCents'] is int)
      //     ? j['priceCents'] as int
      //     : ((j['price'] is int) ? (j['price'] as int) * 100 : 0),
      priceCents: (j['priceCents'] is int)
          ? j['priceCents'] as int
          : ((j['price'] is int) ? (j['price'] as int) : 0),
      interval: j['interval']?.toString() ?? 'month',
      accessTier: (tierData?['accessTier'] is int)
          ? tierData!['accessTier'] as int
          : (j['accessTier'] is int ? j['accessTier'] as int : 1),
      isFeatured: tierData?['isFeatured'] == true || j['isFeatured'] == true,
      features: feats,
    );
  }
}

class CheckInRecord {
  final String id;
  final String gymId;
  final String gymName;
  final String gymImageUrl;
  final DateTime checkedInAt;

  CheckInRecord({
    required this.id,
    required this.gymId,
    required this.gymName,
    required this.gymImageUrl,
    required this.checkedInAt,
  });

  String get formattedDate {
    final d = checkedInAt;
    final now = DateTime.now();
    final diff = now.difference(d);
    if (diff.inDays == 0) return 'Today, ${_fmt(d)}';
    if (diff.inDays == 1) return 'Yesterday, ${_fmt(d)}';
    return '${_dayName(d.weekday)}, ${d.day} ${_monthName(d.month)} ${d.year}, ${_fmt(d)}';
  }

  String _fmt(DateTime d) =>
      '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
  String _dayName(int w) =>
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][w - 1];
  String _monthName(int m) => [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][m - 1];

  factory CheckInRecord.fromJson(Map<String, dynamic> j) {
    final gym = j['gym'] as Map<String, dynamic>? ?? {};
    return CheckInRecord(
      id: j['id']?.toString() ?? '',
      gymId: j['gymId']?.toString() ?? '',
      gymName: gym['name']?.toString() ?? 'Unknown Gym',
      gymImageUrl:
          gym['coverImageUrl']?.toString() ??
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80',
      checkedInAt: j['checkedInAt'] != null
          ? DateTime.tryParse(j['checkedInAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 — AUTH MANAGER (Singleton)
// ═══════════════════════════════════════════════════════════════════════════

class AuthManager {
  static final AuthManager _i = AuthManager._();
  factory AuthManager() => _i;
  AuthManager._();

  String? _token;
  UserModel? _user;
  Position? _location;
  String _address = 'Fetching location…';
  final _storage = const FlutterSecureStorage();

  final ValueNotifier<bool> authNotifier = ValueNotifier(false);
  final ValueNotifier<bool> locationNotifier = ValueNotifier(false);

  bool get isAuth => _token != null;
  String? get token => _token;
  UserModel? get user => _user;
  Position? get location => _location;
  String get address => _address;

  void _setSession(String token, UserModel user) {
    _token = token;
    _user = user;
    _storage.write(key: 'jwt_token', value: token);
    authNotifier.value = !authNotifier.value; // trigger rebuild
  }

  void updateUser(UserModel user) {
    _user = user;
    authNotifier.value = !authNotifier.value;
  }

  Future<bool> loadSession() async {
    final tok = await _storage.read(key: 'jwt_token');
    if (tok == null) return false;
    try {
      final profile = await ApiService().getProfile(tok);
      final u = UserModel.fromJson(profile);
      _token = tok;
      _user = u;
      authNotifier.value = true;
      return true;
    } catch (_) {
      logout();
      return false;
    }
  }

  void logout() {
    _token = null;
    _user = null;
    _storage.delete(key: 'jwt_token');
    authNotifier.value = false;
  }

  Future<void> fetchLocation() async {
    locationNotifier.value = false;
    try {
      LocationPermission perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied)
        perm = await Geolocator.requestPermission();
      if (perm == LocationPermission.denied ||
          perm == LocationPermission.deniedForever) {
        _address = 'Location denied';
        return;
      }
      final pos = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 10),
      );
      _location = pos;
      if (!kIsWeb) {
        try {
          final marks = await placemarkFromCoordinates(
            pos.latitude,
            pos.longitude,
          );
          if (marks.isNotEmpty) {
            final p = marks.first;
            _address = [
              p.street,
              p.locality,
              p.administrativeArea,
              p.country,
            ].where((s) => s != null && s.isNotEmpty).join(', ');
          }
        } catch (_) {
          _address =
              '${pos.latitude.toStringAsFixed(3)}, ${pos.longitude.toStringAsFixed(3)}';
        }
      } else {
        _address =
            '${pos.latitude.toStringAsFixed(3)}, ${pos.longitude.toStringAsFixed(3)}';
      }
    } catch (e) {
      _address = 'Location unavailable';
    } finally {
      locationNotifier.value = true;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 5 — API SERVICE (fully backend-aligned)
// ═══════════════════════════════════════════════════════════════════════════

class ApiService {
  const ApiService();

  Map<String, String> _json() => {'Content-Type': 'application/json'};

  Map<String, String> _auth() {
    final t = AuthManager().token;
    if (t == null) throw Exception('Not authenticated');
    return {'Authorization': 'Bearer $t', 'Content-Type': 'application/json'};
  }

  dynamic _handle(http.Response r) {
    if (r.statusCode >= 200 && r.statusCode < 300) {
      if (r.body.isEmpty) return {};
      return convert.jsonDecode(r.body);
    }
    dynamic b;
    try {
      b = convert.jsonDecode(r.body);
    } catch (_) {
      b = {};
    }
    final msg = b is Map
        ? (b['message'] ?? b['error'] ?? 'Request failed (${r.statusCode})')
        : 'Request failed (${r.statusCode})';
    throw Exception(msg);
  }

  // ── AUTH ──────────────────────────────────────────────────────────────
  // POST /api/auth/signup → { success, message }
  Future<void> signup(String name, String email, String password) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/signup'),
      headers: _json(),
      body: convert.jsonEncode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );
    _handle(r);
  }

  // POST /api/auth/verify-otp → { token, user, success }
  Future<Map<String, dynamic>> verifyOtp(String email, String otp) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/verify-otp'),
      headers: _json(),
      body: convert.jsonEncode({'email': email, 'otp': otp}),
    );
    return _handle(r);
  }

  // POST /api/auth/resend-otp → { success, message }
  Future<void> resendOtp(String email) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/resend-otp'),
      headers: _json(),
      body: convert.jsonEncode({'email': email}),
    );
    _handle(r);
  }

  // POST /api/auth/login → { token, user, requiresVerification? }
  Future<Map<String, dynamic>> login(String email, String password) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/login'),
      headers: _json(),
      body: convert.jsonEncode({'email': email, 'password': password}),
    );
    return _handle(r);
  }

  // GET /api/auth/me OR /api/members/profile → full user with activeSubscription
  Future<Map<String, dynamic>> getProfile(String tok) async {
    final r = await http.get(
      Uri.parse('${AppConfig.baseUrl}/members/profile'),
      headers: {'Authorization': 'Bearer $tok'},
    );
    return _handle(r);
  }

  // POST /api/auth/forgot-password → { success, message }
  Future<void> forgotPassword(String email) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/forgot-password'),
      headers: _json(),
      body: convert.jsonEncode({'email': email}),
    );
    _handle(r);
  }

  // POST /api/auth/reset-password → { success, message }
  Future<void> resetPassword(
    String email,
    String otp,
    String newPassword,
  ) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/reset-password'),
      headers: _json(),
      body: convert.jsonEncode({
        'email': email,
        'otp': otp,
        'newPassword': newPassword,
      }),
    );
    _handle(r);
  }

  // ── GYMS ──────────────────────────────────────────────────────────────
  // GET /api/gyms?latitude=&longitude= → [] or { gyms: [] }
  Future<List<GymModel>> getGyms() async {
    final loc = AuthManager().location;
    final params = <String, String>{};
    if (loc != null) {
      params['latitude'] = loc.latitude.toString();
      params['longitude'] = loc.longitude.toString();
    }
    final uri = Uri.parse(
      '${AppConfig.baseUrl}/gyms',
    ).replace(queryParameters: params);
    final r = await http.get(uri, headers: _auth());
    final body = _handle(r);
    List<dynamic> list;
    if (body is List) {
      list = body;
    } else if (body is Map && body['gyms'] is List) {
      list = body['gyms'] as List;
    } else {
      list = [];
    }
    return list
        .map((j) => GymModel.fromJson(j as Map<String, dynamic>))
        .toList();
  }

  // GET /api/gyms/:id → { success, gym } or gym directly
  Future<GymModel> getGym(String gymId) async {
    final r = await http.get(
      Uri.parse('${AppConfig.baseUrl}/gyms/$gymId'),
      headers: _auth(),
    );
    final body = _handle(r);
    if (body is Map && body['gym'] is Map) {
      return GymModel.fromJson(body['gym'] as Map<String, dynamic>);
    }
    return GymModel.fromJson(body as Map<String, dynamic>);
  }

  // ── QR ────────────────────────────────────────────────────────────────
  // GET /api/qr/:gymId/qr → { gymId, gymName, qrToken, expiresIn }
  // IMPORTANT: QR token is a short-lived JWT generated server-side (60s)
  // The scanner must call this endpoint FIRST to get the current token,
  // then show it to the gym owner's scanner (or use a static QR at the gym).
  // For member check-in flow: gym has a physical QR; member scans it.
  // The QR contains the gymId+JWT. Backend validates it via /api/checkin.
  Future<Map<String, dynamic>> getGymQrToken(String gymId) async {
    final r = await http.get(
      Uri.parse('${AppConfig.baseUrl}/qr/$gymId/qr'),
      headers: _auth(),
    );
    return _handle(r);
  }

  // ── CHECK-IN ──────────────────────────────────────────────────────────
  // POST /api/checkin → { success, message, tier }
  // qrToken = raw value scanned from QR (JWT containing gymId + jti)
  Future<bool> checkIn(String qrToken) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/checkin'),
      headers: _auth(),
      body: convert.jsonEncode({'qrToken': qrToken}),
    );
    final body = _handle(r);
    return body['success'] == true;
  }

  // ── SUBSCRIPTION ──────────────────────────────────────────────────────
  // GET /api/subscription/plans → [] of SubscriptionPrice with tier
  Future<List<SubscriptionPlanModel>> getPlans() async {
    final r = await http.get(
      Uri.parse('${AppConfig.baseUrl}/subscription/plans'),
    );
    final body = _handle(r);
    List<dynamic> list;
    if (body is List) {
      list = body;
    } else if (body is Map && body['plans'] is List) {
      list = body['plans'] as List;
    } else {
      list = [];
    }
    final plans = list
        .map((j) => SubscriptionPlanModel.fromJson(j as Map<String, dynamic>))
        .toList();
    plans.sort((a, b) => a.priceCents.compareTo(b.priceCents));
    return plans;
  }

  // POST /api/subscription/create-session → { url }
  // priceId = SubscriptionPrice.stripePriceId
  Future<String> createCheckoutSession(String stripePriceId) async {
    final r = await http.post(
      Uri.parse('${AppConfig.baseUrl}/subscription/create-session'),
      headers: _auth(),
      body: convert.jsonEncode({'priceId': stripePriceId}),
    );
    final body = _handle(r);
    final url = body['url']?.toString();
    if (url == null) throw Exception('No checkout URL received');
    return url;
  }

  // GET /api/subscription/status → { hasActiveSubscription, activePlan, accessTier, expiresAt }
  Future<Map<String, dynamic>> getSubscriptionStatus() async {
    final r = await http.get(
      Uri.parse('${AppConfig.baseUrl}/subscription/status'),
      headers: _auth(),
    );
    return _handle(r);
  }

  // ── CHECK-IN HISTORY (PLACEHOLDER — endpoint not yet implemented) ──────
  // Future endpoint: GET /api/members/checkins
  Future<List<CheckInRecord>> getCheckInHistory() async {
    // TODO: Replace with real API when backend implements it
    // final r = await http.get(
    //   Uri.parse('${AppConfig.baseUrl}/members/checkins'),
    //   headers: _auth(),
    // );
    // final body = _handle(r);
    // return (body['checkins'] as List)
    //     .map((j) => CheckInRecord.fromJson(j))
    //     .toList();

    // Mock data — remove when real endpoint is ready
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      CheckInRecord(
        id: '1',
        gymId: 'g1',
        gymName: 'Iron & Ember Studio',
        gymImageUrl:
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80',
        checkedInAt: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      CheckInRecord(
        id: '2',
        gymId: 'g2',
        gymName: 'Peak Performance Gym',
        gymImageUrl:
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80',
        checkedInAt: DateTime.now().subtract(const Duration(days: 1, hours: 5)),
      ),
      CheckInRecord(
        id: '3',
        gymId: 'g1',
        gymName: 'Iron & Ember Studio',
        gymImageUrl:
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80',
        checkedInAt: DateTime.now().subtract(const Duration(days: 3)),
      ),
    ];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 6 — APP ENTRY
// ═══════════════════════════════════════════════════════════════════════════

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );
  await AuthManager().loadSession();
  await AuthManager().fetchLocation();
  runApp(const GymKeyApp());
}

class GymKeyApp extends StatelessWidget {
  const GymKeyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GymKey',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      initialRoute: AppRoutes.splash,
      routes: {
        AppRoutes.splash: (_) => const SplashScreen(),
        AppRoutes.auth: (_) => const LoginScreen(),
        AppRoutes.register: (_) => const RegisterScreen(),
        AppRoutes.forgotPassword: (_) => const ForgotPasswordScreen(),
        AppRoutes.home: (_) => const MainNavShell(),
        AppRoutes.subscription: (_) => const SubscriptionScreen(),
        AppRoutes.notifications: (_) => const NotificationsScreen(),
        AppRoutes.checkInHistory: (_) => const CheckInHistoryScreen(),
        AppRoutes.aiOnboarding: (_) => const AIOnboardingScreen(),
        AppRoutes.aiWorkout: (_) => const AIWorkoutScreen(),
        AppRoutes.nutrition: (_) => const NutritionScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == AppRoutes.gymDetails) {
          final gym = settings.arguments as GymModel;
          return MaterialPageRoute(builder: (_) => GymDetailScreen(gym: gym));
        }
        return null;
      },
    );
  }

  ThemeData _buildTheme() {
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'Inter',
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme(
        brightness: Brightness.light,
        primary: AppColors.primary,
        onPrimary: AppColors.onPrimary,
        primaryContainer: AppColors.primaryContainer,
        onPrimaryContainer: AppColors.onPrimaryContainer,
        secondary: AppColors.secondary,
        onSecondary: AppColors.onSecondary,
        secondaryContainer: AppColors.secondaryContainer,
        onSecondaryContainer: AppColors.onSecondaryContainer,
        tertiary: AppColors.primary,
        onTertiary: AppColors.onPrimary,
        tertiaryContainer: AppColors.primaryContainer,
        onTertiaryContainer: AppColors.onPrimaryContainer,
        error: AppColors.error,
        onError: Colors.white,
        errorContainer: AppColors.errorContainer,
        onErrorContainer: AppColors.error,
        surface: AppColors.surface,
        onSurface: AppColors.onSurface,
        surfaceContainerHighest: AppColors.surfaceContainerHighest,
        outline: AppColors.outline,
        outlineVariant: AppColors.outlineVariant,
        inverseSurface: AppColors.inverseSurface,
        onInverseSurface: AppColors.inverseOnSurface,
        inversePrimary: Color(0xFFE1C0AD),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.primaryContainer,
        foregroundColor: AppColors.onPrimary,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: IconThemeData(color: AppColors.onPrimary),
        titleTextStyle: TextStyle(
          fontFamily: 'Inter',
          color: AppColors.onPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.3,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceContainerLow,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.secondary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.error, width: 1.5),
        ),
        hintStyle: const TextStyle(
          color: AppColors.outline,
          fontFamily: 'Inter',
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryContainer,
          foregroundColor: AppColors.onPrimary,
          elevation: 0,
          shape: const StadiumBorder(),
          textStyle: const TextStyle(
            fontFamily: 'Inter',
            fontWeight: FontWeight.w600,
            fontSize: 15,
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 7 — REUSABLE WIDGETS
// ═══════════════════════════════════════════════════════════════════════════

// ── Standard App Bar ─────────────────────────────────────────────────────
class GKAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool showBack;
  final List<Widget>? actions;
  const GKAppBar({
    super.key,
    this.title = 'GymKey',
    this.showBack = false,
    this.actions,
  });

  @override
  Size get preferredSize => const Size.fromHeight(60);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.primaryContainer,
      automaticallyImplyLeading: false,
      leading: showBack
          ? IconButton(
              icon: const Icon(Icons.arrow_back, color: AppColors.onPrimary),
              onPressed: () => Navigator.pop(context),
            )
          : null,
      title: Text(
        title,
        style: const TextStyle(
          fontFamily: 'Inter',
          color: AppColors.onPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
      centerTitle: true,
      actions: actions,
    );
  }
}

// ── Gym Card (list / compact) ─────────────────────────────────────────────
class GymCard extends StatelessWidget {
  final GymModel gym;
  final bool compact;
  const GymCard({super.key, required this.gym, this.compact = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () =>
          Navigator.pushNamed(context, AppRoutes.gymDetails, arguments: gym),
      child: Container(
        decoration: luxuryCard,
        clipBehavior: Clip.antiAlias,
        child: compact ? _compact() : _list(),
      ),
    );
  }

  Widget _list() {
    return Row(
      children: [
        _thumb(
          88,
          const BorderRadius.only(
            topLeft: Radius.circular(16),
            bottomLeft: Radius.circular(16),
          ),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        gym.name,
                        style: AppTextStyles.labelMD.copyWith(
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    _tierBadge(),
                  ],
                ),
                const SizedBox(height: 4),
                _locationRow(),
                const SizedBox(height: 4),
                Text(
                  '${gym.distance.toStringAsFixed(1)} km away',
                  style: AppTextStyles.labelSM.copyWith(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),
        const Padding(
          padding: EdgeInsets.only(right: 12),
          child: Icon(Icons.chevron_right, color: AppColors.outline),
        ),
      ],
    );
  }

  Widget _compact() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Stack(
          children: [
            _thumb(
              148,
              const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
              ),
            ),
            Positioned(top: 10, left: 10, child: _tierBadge()),
          ],
        ),
        Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                gym.name,
                style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
              ),
              const SizedBox(height: 4),
              Row(
                children: [
                  _locationRow(),
                  const Spacer(),
                  Text(
                    '${gym.distance.toStringAsFixed(1)} km',
                    style: AppTextStyles.labelSM.copyWith(
                      color: AppColors.secondary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _thumb(double h, BorderRadius br) {
    return ClipRRect(
      borderRadius: br,
      child: Image.network(
        gym.coverImageUrl,
        width: compact ? double.infinity : 88,
        height: h,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => Container(
          width: 88,
          height: h,
          color: AppColors.surfaceContainerHigh,
          child: const Icon(Icons.fitness_center, color: AppColors.outline),
        ),
      ),
    );
  }

  Widget _tierBadge() {
    final isPremium = gym.tier >= 2;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isPremium ? AppColors.secondary : AppColors.surfaceContainerHigh,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        gym.planLabel.toUpperCase(),
        style: AppTextStyles.labelSM.copyWith(
          color: isPremium ? AppColors.onSecondary : AppColors.onSurfaceVariant,
          fontSize: 10,
        ),
      ),
    );
  }

  Widget _locationRow() {
    return Row(
      children: [
        const Icon(
          Icons.location_on_outlined,
          size: 13,
          color: AppColors.outline,
        ),
        const SizedBox(width: 3),
        Flexible(
          child: Text(
            gym.address,
            style: AppTextStyles.labelSM.copyWith(fontWeight: FontWeight.w400),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}

// ── Loading Skeleton ──────────────────────────────────────────────────────
class SkeletonBox extends StatefulWidget {
  final double width, height, radius;
  const SkeletonBox({
    super.key,
    required this.width,
    required this.height,
    this.radius = 8,
  });

  @override
  State<SkeletonBox> createState() => _SkeletonBoxState();
}

class _SkeletonBoxState extends State<SkeletonBox>
    with SingleTickerProviderStateMixin {
  late AnimationController _c;
  late Animation<double> _a;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);
    _a = Tween(begin: 0.4, end: 1.0).animate(_c);
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _a,
      child: Container(
        width: widget.width,
        height: widget.height,
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(widget.radius),
        ),
      ),
    );
  }
}

// ── Snackbar helpers ──────────────────────────────────────────────────────
void showError(BuildContext ctx, String msg) {
  ScaffoldMessenger.of(ctx).showSnackBar(
    SnackBar(
      content: Text(msg, style: const TextStyle(fontFamily: 'Inter')),
      backgroundColor: AppColors.error,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
  );
}

void showSuccess(BuildContext ctx, String msg) {
  ScaffoldMessenger.of(ctx).showSnackBar(
    SnackBar(
      content: Text(msg, style: const TextStyle(fontFamily: 'Inter')),
      backgroundColor: AppColors.success,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    ),
  );
}

// ── Primary CTA Button ────────────────────────────────────────────────────
class GKButton extends StatelessWidget {
  final String label;
  final VoidCallback? onTap;
  final bool loading;
  final Color? bg;
  final IconData? icon;
  const GKButton({
    super.key,
    required this.label,
    this.onTap,
    this.loading = false,
    this.bg,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: ElevatedButton(
        onPressed: loading ? null : onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: bg ?? AppColors.primaryContainer,
          foregroundColor: AppColors.onPrimary,
          shape: const StadiumBorder(),
          elevation: 0,
        ),
        child: loading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2.5,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 18, color: Colors.white),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    label,
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontWeight: FontWeight.w600,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 8 — SPLASH SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashState();
}

class _SplashState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _c;
  late Animation<double> _scale, _fade;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _scale = Tween(
      begin: 0.85,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _c, curve: Curves.easeOutBack));
    _fade = CurvedAnimation(parent: _c, curve: Curves.easeOut);
    _c.forward();
    Future.delayed(const Duration(milliseconds: 1800), () {
      if (mounted) {
        Navigator.pushReplacementNamed(
          context,
          AuthManager().isAuth ? AppRoutes.home : AppRoutes.auth,
        );
      }
    });
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.primaryContainer,
      body: Center(
        child: FadeTransition(
          opacity: _fade,
          child: ScaleTransition(
            scale: _scale,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 88,
                  height: 88,
                  decoration: BoxDecoration(
                    color: AppColors.secondary.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(
                      color: AppColors.secondary.withOpacity(0.4),
                      width: 1.5,
                    ),
                  ),
                  child: const Icon(
                    Icons.fitness_center,
                    size: 46,
                    color: AppColors.onPrimary,
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'GymKey',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    color: AppColors.onPrimary,
                    fontSize: 40,
                    fontWeight: FontWeight.w800,
                    letterSpacing: -1.5,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'MEMBERS ONLY ACCESS',
                  style: AppTextStyles.labelSM.copyWith(
                    color: AppColors.onPrimary.withOpacity(0.55),
                    letterSpacing: 3,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 9 — LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginState();
}

class _LoginState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true, _loading = false;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    final email = _emailCtrl.text.trim();
    final pass = _passCtrl.text;
    if (email.isEmpty || pass.isEmpty) {
      showError(context, 'Please fill in all fields');
      return;
    }
    setState(() => _loading = true);
    try {
      final res = await const ApiService().login(email, pass);
      // Backend returns: { token, user, requiresVerification? }
      if (res['requiresVerification'] == true) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => OTPScreen(email: email, isLogin: true),
          ),
        );
        return;
      }
      final token = res['token']?.toString();
      if (token == null) throw Exception('Invalid server response');

      // ✅ FIXED: Convert Map<<dynamic, dynamic> to Map<String, dynamic>
      final userJson = res['user'] is Map
          ? (res['user'] as Map).map(
              (key, value) => MapEntry(key.toString(), value),
            )
          : <String, dynamic>{};

      final user = UserModel.fromJson(userJson);
      AuthManager()._setSession(token, user);
      Navigator.pushReplacementNamed(context, AppRoutes.home);
    } catch (e) {
      showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final h = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          // ── Hero Header ──────────────────────────────────────────────────
          SizedBox(
            height: h * 0.34,
            width: double.infinity,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Container(color: AppColors.primaryContainer),
                ),
                Container(color: const Color(0xCC2C1A0E)),
                SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'GymKey',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          color: Colors.white,
                          fontSize: 44,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'MEMBERS ONLY ACCESS',
                        style: AppTextStyles.labelSM.copyWith(
                          color: Colors.white54,
                          letterSpacing: 3,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // ── Form ─────────────────────────────────────────────────────────
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 32),
                child: Transform.translate(
                  offset: const Offset(0, -32),
                  child: Container(
                    decoration: luxuryCard,
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Welcome Back', style: AppTextStyles.headlineLG),
                        const SizedBox(height: 4),
                        Text(
                          'Sign in to resume your discipline.',
                          style: AppTextStyles.bodyMD.copyWith(
                            color: AppColors.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(height: 24),

                        _label('Email Address'),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _emailCtrl,
                          keyboardType: TextInputType.emailAddress,
                          decoration: const InputDecoration(
                            hintText: 'name@example.com',
                            prefixIcon: Icon(
                              Icons.mail_outline,
                              color: AppColors.outline,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _label('Password'),
                            GestureDetector(
                              onTap: () => Navigator.pushNamed(
                                context,
                                AppRoutes.forgotPassword,
                              ),
                              child: Text(
                                'Forgot Password?',
                                style: AppTextStyles.labelMD.copyWith(
                                  color: AppColors.secondary,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        TextField(
                          controller: _passCtrl,
                          obscureText: _obscure,
                          decoration: InputDecoration(
                            hintText: '••••••••',
                            prefixIcon: const Icon(
                              Icons.lock_outline,
                              color: AppColors.outline,
                            ),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _obscure
                                    ? Icons.visibility_off_outlined
                                    : Icons.visibility_outlined,
                                color: AppColors.outline,
                              ),
                              onPressed: () =>
                                  setState(() => _obscure = !_obscure),
                            ),
                          ),
                        ),
                        const SizedBox(height: 28),

                        GKButton(
                          label: 'Sign In',
                          loading: _loading,
                          onTap: _login,
                        ),
                        const SizedBox(height: 20),

                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              "Don't have an account? ",
                              style: AppTextStyles.bodyMD.copyWith(
                                color: AppColors.onSurfaceVariant,
                              ),
                            ),
                            GestureDetector(
                              onTap: () => Navigator.pushNamed(
                                context,
                                AppRoutes.register,
                              ),
                              child: Text(
                                'Join Now',
                                style: AppTextStyles.bodyMD.copyWith(
                                  color: AppColors.secondary,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _label(String t) => Text(
    t,
    style: AppTextStyles.labelMD.copyWith(color: AppColors.onSurfaceVariant),
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 10 — REGISTER SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterState();
}

class _RegisterState extends State<RegisterScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _obscure = true, _loading = false;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    final name = _nameCtrl.text.trim();
    final email = _emailCtrl.text.trim();
    final pass = _passCtrl.text;
    if (name.isEmpty || email.isEmpty || pass.isEmpty) {
      showError(context, 'Please fill in all fields');
      return;
    }
    if (pass.length < 8) {
      showError(context, 'Password must be at least 8 characters');
      return;
    }
    setState(() => _loading = true);
    try {
      await const ApiService().signup(name, email, pass);
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => OTPScreen(email: email, isLogin: false),
        ),
      );
    } catch (e) {
      showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Column(
        children: [
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.28,
            width: double.infinity,
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.network(
                  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80',
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) =>
                      Container(color: AppColors.primaryContainer),
                ),
                Container(color: const Color(0xDD2C1A0E)),
                SafeArea(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'GymKey',
                        style: TextStyle(
                          fontFamily: 'Inter',
                          color: Colors.white,
                          fontSize: 38,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -1.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'JOIN THE ELITE MOVEMENT',
                        style: AppTextStyles.labelSM.copyWith(
                          color: Colors.white54,
                          letterSpacing: 2.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 40),
              child: Transform.translate(
                offset: const Offset(0, -28),
                child: Container(
                  decoration: luxuryCard,
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Create Account', style: AppTextStyles.headlineLG),
                      const SizedBox(height: 4),
                      Text(
                        'Start your journey to discipline.',
                        style: AppTextStyles.bodyMD.copyWith(
                          color: AppColors.onSurfaceVariant,
                        ),
                      ),
                      const SizedBox(height: 24),

                      _field('Full Name', Icons.person_outline, _nameCtrl),
                      const SizedBox(height: 14),
                      _field(
                        'Email Address',
                        Icons.mail_outline,
                        _emailCtrl,
                        type: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 14),
                      TextField(
                        controller: _passCtrl,
                        obscureText: _obscure,
                        decoration: InputDecoration(
                          hintText: 'Password (min 8 characters)',
                          prefixIcon: const Icon(
                            Icons.lock_outline,
                            color: AppColors.outline,
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscure
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              color: AppColors.outline,
                            ),
                            onPressed: () =>
                                setState(() => _obscure = !_obscure),
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),

                      GKButton(
                        label: 'Create Account',
                        loading: _loading,
                        onTap: _register,
                      ),
                      const SizedBox(height: 20),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Already a member? ',
                            style: AppTextStyles.bodyMD.copyWith(
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => Navigator.pop(context),
                            child: Text(
                              'Sign In',
                              style: AppTextStyles.bodyMD.copyWith(
                                color: AppColors.secondary,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _field(
    String hint,
    IconData icon,
    TextEditingController ctrl, {
    TextInputType type = TextInputType.text,
  }) {
    return TextField(
      controller: ctrl,
      keyboardType: type,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon, color: AppColors.outline),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 11 — OTP SCREEN (verify-otp + resend-otp)
// ═══════════════════════════════════════════════════════════════════════════

class OTPScreen extends StatefulWidget {
  final String email;
  final bool isLogin; // true = verify existing account, false = post-register
  const OTPScreen({super.key, required this.email, required this.isLogin});

  @override
  State<OTPScreen> createState() => _OTPState();
}

class _OTPState extends State<OTPScreen> {
  final _ctrls = List.generate(6, (_) => TextEditingController());
  final _foci = List.generate(6, (_) => FocusNode());
  bool _loading = false, _resending = false;
  int _resendCooldown = 0;
  Timer? _timer;

  @override
  void dispose() {
    for (final c in _ctrls) c.dispose();
    for (final f in _foci) f.dispose();
    _timer?.cancel();
    super.dispose();
  }

  String get _otp => _ctrls.map((c) => c.text).join();

  void _startCooldown() {
    _resendCooldown = 60;
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (!mounted) {
        t.cancel();
        return;
      }
      setState(() {
        _resendCooldown--;
        if (_resendCooldown <= 0) t.cancel();
      });
    });
  }

  Future<void> _resend() async {
    setState(() => _resending = true);
    try {
      await const ApiService().resendOtp(widget.email);
      _startCooldown();
      if (mounted) showSuccess(context, 'OTP resent to ${widget.email}');
    } catch (e) {
      if (mounted)
        showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _resending = false);
    }
  }

  Future<void> _verify() async {
    if (_otp.length < 6) {
      showError(context, 'Enter the complete 6-digit code');
      return;
    }
    setState(() => _loading = true);
    try {
      final res = await const ApiService().verifyOtp(widget.email, _otp);
      final token = res['token']?.toString();
      if (token == null) throw Exception('Invalid server response');

      // ✅ FIXED: Convert Map<<dynamic, dynamic> to Map<String, dynamic>
      final userJson = res['user'] is Map
          ? (res['user'] as Map).map(
              (key, value) => MapEntry(key.toString(), value),
            )
          : <String, dynamic>{};

      final user = UserModel.fromJson(userJson);
      AuthManager()._setSession(token, user);
      Navigator.pushNamedAndRemoveUntil(context, AppRoutes.home, (r) => false);
    } catch (e) {
      showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey', showBack: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const SizedBox(height: 16),
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.outlineVariant),
              ),
              child: const Icon(
                Icons.mark_email_read_outlined,
                size: 38,
                color: AppColors.secondary,
              ),
            ),
            const SizedBox(height: 24),
            Text('Verify your account', style: AppTextStyles.headlineLG),
            const SizedBox(height: 8),
            Text(
              'Enter the 6-digit code sent to\n${widget.email}',
              textAlign: TextAlign.center,
              style: AppTextStyles.bodyMD.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 36),

            // OTP boxes
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(6, (i) {
                return Container(
                  width: 48,
                  height: 58,
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  child: TextField(
                    controller: _ctrls[i],
                    focusNode: _foci[i],
                    maxLength: 1,
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    style: AppTextStyles.headlineMD.copyWith(fontSize: 22),
                    decoration: InputDecoration(
                      counterText: '',
                      filled: true,
                      fillColor: AppColors.surfaceContainerLow,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none,
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: const BorderSide(
                          color: AppColors.secondary,
                          width: 2,
                        ),
                      ),
                      contentPadding: EdgeInsets.zero,
                    ),
                    onChanged: (v) {
                      if (v.isNotEmpty && i < 5) {
                        _foci[i + 1].requestFocus();
                      } else if (v.isEmpty && i > 0) {
                        _foci[i - 1].requestFocus();
                      }
                    },
                  ),
                );
              }),
            ),
            const SizedBox(height: 36),

            GKButton(
              label: 'Verify Identity',
              loading: _loading,
              onTap: _verify,
            ),
            const SizedBox(height: 20),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Didn't receive the code? ",
                  style: AppTextStyles.bodyMD.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                ),
                _resendCooldown > 0
                    ? Text(
                        'Resend in ${_resendCooldown}s',
                        style: AppTextStyles.bodyMD.copyWith(
                          color: AppColors.outline,
                        ),
                      )
                    : GestureDetector(
                        onTap: _resending ? null : _resend,
                        child: Text(
                          'Resend Code',
                          style: AppTextStyles.bodyMD.copyWith(
                            color: AppColors.secondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 12 — FORGOT PASSWORD SCREEN (2-step: send OTP → reset)
// ═══════════════════════════════════════════════════════════════════════════

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPassState();
}

class _ForgotPassState extends State<ForgotPasswordScreen> {
  int _step = 0; // 0=email, 1=otp+newpass
  final _emailCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  final _newPassCtrl = TextEditingController();
  bool _loading = false, _obscure = true;

  Future<void> _sendOtp() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty) {
      showError(context, 'Enter your email address');
      return;
    }
    setState(() => _loading = true);
    try {
      await const ApiService().forgotPassword(email);
      setState(() => _step = 1);
      showSuccess(context, 'Reset code sent to $email');
    } catch (e) {
      showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _resetPassword() async {
    final otp = _otpCtrl.text.trim();
    final newPass = _newPassCtrl.text;
    if (otp.length < 6) {
      showError(context, 'Enter the complete 6-digit code');
      return;
    }
    if (newPass.length < 8) {
      showError(context, 'Password must be at least 8 characters');
      return;
    }
    setState(() => _loading = true);
    try {
      await const ApiService().resetPassword(
        _emailCtrl.text.trim(),
        otp,
        newPass,
      );
      showSuccess(context, 'Password reset successful');
      Navigator.pushReplacementNamed(context, AppRoutes.auth);
    } catch (e) {
      showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey', showBack: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Step indicator
            Row(
              children: [
                _step_(1, 'Email', _step >= 0),
                _line(),
                _step_(2, 'Reset', _step >= 1),
              ],
            ),
            const SizedBox(height: 32),

            Text('Reset Password', style: AppTextStyles.headlineXL),
            const SizedBox(height: 8),
            Text(
              _step == 0
                  ? 'Enter your registered email to receive a secure reset code.'
                  : 'Enter the OTP sent to ${_emailCtrl.text.trim()} and your new password.',
              style: AppTextStyles.bodyMD.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 28),

            if (_step == 0) ...[
              Text(
                'Email Address',
                style: AppTextStyles.labelMD.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _emailCtrl,
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                  hintText: 'name@example.com',
                  prefixIcon: Icon(
                    Icons.mail_outline,
                    color: AppColors.outline,
                  ),
                ),
              ),
              const SizedBox(height: 28),
              GKButton(
                label: 'Send Reset Code',
                loading: _loading,
                onTap: _sendOtp,
              ),
            ] else ...[
              Text(
                'Verification Code',
                style: AppTextStyles.labelMD.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _otpCtrl,
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: AppTextStyles.headlineMD,
                decoration: const InputDecoration(
                  hintText: '6-digit code',
                  counterText: '',
                  prefixIcon: Icon(
                    Icons.pin_outlined,
                    color: AppColors.outline,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'New Password',
                style: AppTextStyles.labelMD.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _newPassCtrl,
                obscureText: _obscure,
                decoration: InputDecoration(
                  hintText: 'New password (min 8 characters)',
                  prefixIcon: const Icon(
                    Icons.lock_outline,
                    color: AppColors.outline,
                  ),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscure
                          ? Icons.visibility_off_outlined
                          : Icons.visibility_outlined,
                      color: AppColors.outline,
                    ),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  ),
                ),
              ),
              const SizedBox(height: 28),
              GKButton(
                label: 'Reset Password',
                loading: _loading,
                onTap: _resetPassword,
              ),
              const SizedBox(height: 16),
              GestureDetector(
                onTap: () => setState(() => _step = 0),
                child: Text(
                  '← Change email address',
                  style: AppTextStyles.labelMD.copyWith(
                    color: AppColors.secondary,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _step_(int n, String label, bool active) => Column(
    children: [
      CircleAvatar(
        radius: 20,
        backgroundColor: active
            ? AppColors.secondary
            : AppColors.surfaceContainerHigh,
        child: Text(
          '$n',
          style: TextStyle(
            fontFamily: 'Inter',
            color: active ? AppColors.onSecondary : AppColors.onSurfaceVariant,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      const SizedBox(height: 4),
      Text(
        label,
        style: AppTextStyles.labelSM.copyWith(
          color: active ? AppColors.secondary : AppColors.onSurfaceVariant,
        ),
      ),
    ],
  );

  Widget _line() => Expanded(
    child: Container(
      height: 2,
      color: AppColors.outlineVariant,
      margin: const EdgeInsets.only(bottom: 20),
    ),
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 13 — MAIN NAV SHELL
// ═══════════════════════════════════════════════════════════════════════════

class MainNavShell extends StatefulWidget {
  const MainNavShell({super.key});

  @override
  State<MainNavShell> createState() => _NavShellState();
}

class _NavShellState extends State<MainNavShell> {
  int _idx = 0;
  final _screens = const [
    HomeScreen(),
    CheckInScreen(),
    FindGymScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _idx, children: _screens),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          border: Border(
            top: BorderSide(color: AppColors.outlineVariant, width: 0.5),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _idx,
          onTap: (i) => setState(() => _idx = i),
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: AppColors.secondary,
          unselectedItemColor: AppColors.outline,
          selectedLabelStyle: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
          unselectedLabelStyle: const TextStyle(
            fontFamily: 'Inter',
            fontSize: 11,
          ),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.qr_code_scanner_outlined),
              activeIcon: Icon(Icons.qr_code_scanner),
              label: 'Check In',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.explore_outlined),
              activeIcon: Icon(Icons.explore),
              label: 'Explore',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 14 — HOME SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeState();
}

class _HomeState extends State<HomeScreen> {
  late Future<List<GymModel>> _gymsFuture;
  late Future<List<SubscriptionPlanModel>> _plansFuture;

  @override
  void initState() {
    super.initState();
    _gymsFuture = const ApiService().getGyms();
    _plansFuture = const ApiService().getPlans();
  }

  Future<void> _refresh() async {
    await AuthManager().fetchLocation();
    setState(() {
      _gymsFuture = const ApiService().getGyms();
      _plansFuture = const ApiService().getPlans();
    });
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: AuthManager().authNotifier,
      builder: (_, __, ___) {
        final user = AuthManager().user;
        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(60),
            child: AppBar(
              backgroundColor: AppColors.primaryContainer,
              automaticallyImplyLeading: false,
              title: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Welcome back,',
                    style: AppTextStyles.labelMD.copyWith(
                      color: AppColors.onPrimary.withOpacity(0.65),
                    ),
                  ),
                  Text(
                    user?.name ?? 'Guest',
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      color: AppColors.onPrimary,
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              actions: [
                IconButton(
                  icon: const Icon(
                    Icons.notifications_outlined,
                    color: AppColors.onPrimary,
                  ),
                  onPressed: () =>
                      Navigator.pushNamed(context, AppRoutes.notifications),
                ),
                const SizedBox(width: 4),
              ],
            ),
          ),
          body: RefreshIndicator(
            color: AppColors.secondary,
            onRefresh: _refresh,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _heroCard(context, user),
                  const SizedBox(height: 24),
                  _membershipBanner(context, user),
                  if (!(user?.hasActivePlan ?? false)) ...[
                    const SizedBox(height: 24),
                    Text('Available Plans', style: AppTextStyles.headlineMD),
                    const SizedBox(height: 12),
                    _PlansRow(future: _plansFuture),
                  ],
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: _featureTile(
                          context,
                          Icons.auto_awesome,
                          'AI Workout',
                          'Personalized plan',
                          AppColors.secondary,
                          AppRoutes.aiWorkout,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _featureTile(
                          context,
                          Icons.restaurant_menu_outlined,
                          'Nutrition',
                          'Track macros',
                          AppColors.primary,
                          AppRoutes.nutrition,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Nearby Studios', style: AppTextStyles.headlineMD),
                      GestureDetector(
                        onTap: () {},
                        child: Text(
                          'See All',
                          style: AppTextStyles.labelMD.copyWith(
                            color: AppColors.secondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  _NearbyGyms(future: _gymsFuture),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _heroCard(BuildContext context, UserModel? user) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primaryContainer, Color(0xFF3D2616)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
            color: Color(0x302C1A0E),
            blurRadius: 24,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (user?.hasActivePlan == true)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              decoration: BoxDecoration(
                color: AppColors.secondary.withOpacity(0.25),
                borderRadius: BorderRadius.circular(99),
              ),
              child: Text(
                '${user!.membershipTier?.toUpperCase()} MEMBER',
                style: const TextStyle(
                  fontFamily: 'Inter',
                  color: AppColors.secondaryContainer,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          const SizedBox(height: 14),
          const Text(
            'Elevate Your\nTraining',
            style: TextStyle(
              fontFamily: 'Inter',
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.w800,
              height: 1.15,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            'Access premium boutique studios with one single key.',
            style: TextStyle(
              fontFamily: 'Inter',
              color: Colors.white.withOpacity(0.72),
              fontSize: 14,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 20),
          GestureDetector(
            onTap: () => Navigator.pushNamed(context, AppRoutes.subscription),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.secondary,
                borderRadius: BorderRadius.circular(99),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.secondary.withOpacity(0.4),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Text(
                user?.hasActivePlan == true ? 'Manage Plan' : 'Upgrade Plan',
                style: const TextStyle(
                  fontFamily: 'Inter',
                  color: Colors.white,
                  fontWeight: FontWeight.w700,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _membershipBanner(BuildContext context, UserModel? user) {
    final active = user?.hasActivePlan == true;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: active ? AppColors.successContainer : AppColors.warningContainer,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: active ? const Color(0xFF4ADE80) : const Color(0xFFFBBF24),
        ),
      ),
      child: Row(
        children: [
          Icon(
            active ? Icons.verified_rounded : Icons.warning_amber_rounded,
            color: active ? AppColors.success : AppColors.warning,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              active
                  ? 'Active: ${user!.membershipTier}'
                        '${user.membershipEndAt != null ? ' · Renews ${_fmtDate(user.membershipEndAt!)}' : ''}'
                  : 'No active plan — upgrade to access gyms',
              style: AppTextStyles.labelMD.copyWith(
                color: active ? AppColors.success : AppColors.warning,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          if (!active)
            GestureDetector(
              onTap: () => Navigator.pushNamed(context, AppRoutes.subscription),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: AppColors.warning,
                  borderRadius: BorderRadius.circular(99),
                ),
                child: const Text(
                  'Upgrade',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _featureTile(
    BuildContext ctx,
    IconData icon,
    String title,
    String sub,
    Color color,
    String route,
  ) {
    return GestureDetector(
      onTap: () => Navigator.pushNamed(ctx, route),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.07),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 26),
            const SizedBox(height: 10),
            Text(
              title,
              style: AppTextStyles.labelMD.copyWith(
                color: color,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              sub,
              style: AppTextStyles.labelSM.copyWith(
                fontWeight: FontWeight.w400,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _fmtDate(DateTime d) =>
      '${d.day} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.month - 1]} ${d.year}';
}

class _PlansRow extends StatelessWidget {
  final Future<List<SubscriptionPlanModel>> future;
  const _PlansRow({required this.future});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<SubscriptionPlanModel>>(
      future: future,
      builder: (_, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return SizedBox(
            height: 130,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: 3,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (_, __) =>
                  const SkeletonBox(width: 150, height: 130, radius: 14),
            ),
          );
        }
        final plans = snap.data ?? [];
        if (plans.isEmpty) return const SizedBox();
        return SizedBox(
          height: 160,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: plans.length,
            separatorBuilder: (_, __) => const SizedBox(width: 12),
            itemBuilder: (ctx, i) {
              final p = plans[i];
              final c = planTierColor(p.accessTier);
              return GestureDetector(
                onTap: () => Navigator.pushNamed(ctx, AppRoutes.subscription),
                child: Container(
                  width: 160,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: c.withOpacity(0.07),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: c.withOpacity(0.35)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        p.tierName,
                        style: AppTextStyles.labelMD.copyWith(
                          color: c,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Expanded(
                        child: Text(
                          p.description.isNotEmpty
                              ? p.description
                              : p.features.take(2).join(', '),
                          style: AppTextStyles.labelSM.copyWith(
                            fontWeight: FontWeight.w400,
                            height: 1.4,
                          ),
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Rs. ${p.displayPrice} / ${p.interval}',
                        style: AppTextStyles.labelMD.copyWith(
                          color: c,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
    );
  }
}

class _NearbyGyms extends StatelessWidget {
  final Future<List<GymModel>> future;
  const _NearbyGyms({required this.future});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<GymModel>>(
      future: future,
      builder: (_, snap) {
        if (snap.connectionState == ConnectionState.waiting) {
          return Column(
            children: List.generate(
              2,
              (_) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: SkeletonBox(
                  width: double.infinity,
                  height: 90,
                  radius: 16,
                ),
              ),
            ),
          );
        }
        if (snap.hasError) {
          return _emptyState(
            'Could not load gyms.\nPull down to retry.',
            Icons.wifi_off_outlined,
          );
        }
        final gyms = (snap.data ?? []).take(3).toList();
        if (gyms.isEmpty) {
          return _emptyState(
            'No gyms nearby yet.',
            Icons.location_off_outlined,
          );
        }
        return Column(
          children: gyms
              .map(
                (g) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GymCard(gym: g),
                ),
              )
              .toList(),
        );
      },
    );
  }

  Widget _emptyState(String msg, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          Icon(icon, color: AppColors.outline, size: 36),
          const SizedBox(height: 12),
          Text(
            msg,
            textAlign: TextAlign.center,
            style: AppTextStyles.bodyMD.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 15 — CHECK-IN SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class CheckInScreen extends StatefulWidget {
  const CheckInScreen({super.key});

  @override
  State<CheckInScreen> createState() => _CheckInState();
}

class _CheckInState extends State<CheckInScreen> {
  late Future<List<GymModel>> _future;

  @override
  void initState() {
    super.initState();
    _future = const ApiService().getGyms();
  }

  Future<void> _refresh() async {
    await AuthManager().fetchLocation();
    setState(() => _future = const ApiService().getGyms());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey'),
      body: RefreshIndicator(
        color: AppColors.secondary,
        onRefresh: _refresh,
        child: FutureBuilder<List<GymModel>>(
          future: _future,
          builder: (_, snap) {
            if (snap.connectionState == ConnectionState.waiting) {
              return ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  _header(),
                  const SizedBox(height: 20),
                  ...List.generate(
                    4,
                    (_) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: SkeletonBox(
                        width: double.infinity,
                        height: 90,
                        radius: 16,
                      ),
                    ),
                  ),
                ],
              );
            }
            final gyms = snap.data ?? [];
            return ListView(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
              children: [
                _header(),
                const SizedBox(height: 20),
                if (gyms.isEmpty)
                  _emptyState()
                else
                  ...gyms.map(
                    (g) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: _CheckInCard(gym: g),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }

  Widget _header() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('Check In', style: AppTextStyles.headlineXL),
      const SizedBox(height: 4),
      Text(
        'Select a studio to scan the QR code.',
        style: AppTextStyles.bodyMD.copyWith(color: AppColors.onSurfaceVariant),
      ),
    ],
  );

  Widget _emptyState() => Center(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          const Icon(Icons.fitness_center, color: AppColors.outline, size: 48),
          const SizedBox(height: 16),
          Text(
            'No gyms available nearby.',
            style: AppTextStyles.bodyMD.copyWith(
              color: AppColors.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    ),
  );
}

class _CheckInCard extends StatelessWidget {
  final GymModel gym;
  const _CheckInCard({required this.gym});

  Future<void> _handleCheckIn(BuildContext context) async {
    // CORRECTED FLOW: Fetch live QR token from backend first, then show scanner
    // or navigate directly to scanner which reads the physical QR at the gym
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => QRScannerScreen(gym: gym)),
    ).then((result) {
      if (result == true && context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => CheckInSuccessScreen(gym: gym)),
        );
      } else if (result is String && context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => CheckInFailureScreen(gym: gym, reason: result),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: luxuryCard,
      child: Row(
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(16),
              bottomLeft: Radius.circular(16),
            ),
            child: Image.network(
              gym.coverImageUrl,
              width: 82,
              height: 88,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 82,
                height: 88,
                color: AppColors.surfaceContainerHigh,
                child: const Icon(
                  Icons.fitness_center,
                  color: AppColors.outline,
                ),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    gym.name,
                    style: AppTextStyles.labelMD.copyWith(
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  Text(
                    gym.address,
                    style: AppTextStyles.labelSM.copyWith(
                      fontWeight: FontWeight.w400,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        margin: const EdgeInsets.only(right: 6),
                        decoration: BoxDecoration(
                          color: gym.is24Hours
                              ? AppColors.success
                              : AppColors.secondary,
                          shape: BoxShape.circle,
                        ),
                      ),
                      Text(
                        gym.hoursDisplay,
                        style: AppTextStyles.labelSM.copyWith(
                          color: AppColors.secondary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 14),
            child: GestureDetector(
              onTap: () => _handleCheckIn(context),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 10,
                ),
                decoration: BoxDecoration(
                  color: AppColors.primaryContainer,
                  borderRadius: BorderRadius.circular(99),
                ),
                child: const Text(
                  'CHECK IN',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 16 — QR SCANNER SCREEN
// Backend flow: Physical QR at gym contains a JWT token with gymId.
// Member scans it → frontend sends qrToken to POST /api/checkin
// Backend validates: JWT signature, expiry, gymId match, subscription, tier
// ═══════════════════════════════════════════════════════════════════════════

class QRScannerScreen extends StatefulWidget {
  final GymModel gym;
  const QRScannerScreen({super.key, required this.gym});

  @override
  State<QRScannerScreen> createState() => _QRScannerState();
}

class _QRScannerState extends State<QRScannerScreen> {
  late MobileScannerController _ctrl;
  bool _processing = false;

  @override
  void initState() {
    super.initState();
    _ctrl = MobileScannerController(
      detectionSpeed: DetectionSpeed.normal,
      facing: CameraFacing.back,
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void _onDetect(BarcodeCapture capture) async {
    if (_processing) return;
    final raw = capture.barcodes.firstOrNull?.rawValue;
    if (raw == null || raw.trim().isEmpty) return;
    await _ctrl.stop();
    setState(() => _processing = true);
    try {
      // raw = JWT qrToken from gym's physical QR code
      final success = await const ApiService().checkIn(raw.trim());
      if (mounted) Navigator.pop(context, success);
    } catch (e) {
      final msg = e.toString().replaceAll('Exception: ', '');
      if (mounted) Navigator.pop(context, msg);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: AppColors.primaryContainer,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Check In – ${widget.gym.name}',
          style: const TextStyle(
            fontFamily: 'Inter',
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.flashlight_on, color: Colors.white),
            onPressed: () => _ctrl.toggleTorch(),
          ),
        ],
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: _ctrl,
            onDetect: _onDetect,
            errorBuilder: (_, err, __) => Center(
              child: Text(
                'Camera Error: $err',
                style: const TextStyle(color: Colors.white),
                textAlign: TextAlign.center,
              ),
            ),
          ),
          // Overlay
          Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment.center,
                radius: 0.5,
                colors: [Colors.transparent, Color(0xBB000000)],
              ),
            ),
          ),
          // Scanner frame
          Center(
            child: SizedBox(
              width: 230,
              height: 230,
              child: Stack(
                children: [
                  Positioned(top: 0, left: 0, child: _bracket(tl: true)),
                  Positioned(top: 0, right: 0, child: _bracket(tr: true)),
                  Positioned(bottom: 0, left: 0, child: _bracket(bl: true)),
                  Positioned(bottom: 0, right: 0, child: _bracket(br: true)),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: 80,
            left: 0,
            right: 0,
            child: Text(
              'Scan the QR code at the gym',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Colors.white70,
                fontFamily: 'Inter',
                fontSize: 14,
              ),
            ),
          ),
          if (_processing)
            Container(
              color: Colors.black.withOpacity(0.75),
              child: const Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircularProgressIndicator(color: Colors.white),
                    SizedBox(height: 20),
                    Text(
                      'Validating check-in…',
                      style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Inter',
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _bracket({
    bool tl = false,
    bool tr = false,
    bool bl = false,
    bool br = false,
  }) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        border: Border(
          top: (tl || tr)
              ? const BorderSide(color: Colors.white, width: 3.5)
              : BorderSide.none,
          bottom: (bl || br)
              ? const BorderSide(color: Colors.white, width: 3.5)
              : BorderSide.none,
          left: (tl || bl)
              ? const BorderSide(color: Colors.white, width: 3.5)
              : BorderSide.none,
          right: (tr || br)
              ? const BorderSide(color: Colors.white, width: 3.5)
              : BorderSide.none,
        ),
        borderRadius: BorderRadius.only(
          topLeft: tl ? const Radius.circular(8) : Radius.zero,
          topRight: tr ? const Radius.circular(8) : Radius.zero,
          bottomLeft: bl ? const Radius.circular(8) : Radius.zero,
          bottomRight: br ? const Radius.circular(8) : Radius.zero,
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 17 — CHECK-IN SUCCESS / FAILURE
// ═══════════════════════════════════════════════════════════════════════════

class CheckInSuccessScreen extends StatelessWidget {
  final GymModel gym;
  const CheckInSuccessScreen({super.key, required this.gym});

  @override
  Widget build(BuildContext context) {
    final now = TimeOfDay.now();
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey'),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: AppColors.secondary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.secondary.withOpacity(0.35),
                      blurRadius: 28,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.check_circle,
                  color: Colors.white,
                  size: 54,
                ),
              ),
              const SizedBox(height: 28),
              Text('Check-in Successful!', style: AppTextStyles.headlineXL),
              const SizedBox(height: 8),
              Text(
                "You're all set. Enjoy your session!",
                style: AppTextStyles.bodyMD.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: luxuryCard,
                child: Column(
                  children: [
                    _row('Studio', gym.name, isHeadline: true),
                    const Divider(height: 24, color: AppColors.outlineVariant),
                    Row(
                      children: [
                        Expanded(child: _row('Time', now.format(context))),
                        Expanded(
                          child: _row(
                            'Status',
                            'Confirmed',
                            valueColor: AppColors.secondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              GKButton(
                label: 'Back to Home',
                onTap: () => Navigator.pushNamedAndRemoveUntil(
                  context,
                  AppRoutes.home,
                  (r) => false,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _row(
    String label,
    String value, {
    bool isHeadline = false,
    Color? valueColor,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.labelSM.copyWith(
            color: AppColors.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 3),
        Text(
          value,
          style: isHeadline
              ? AppTextStyles.headlineMD
              : AppTextStyles.bodyMD.copyWith(
                  fontWeight: FontWeight.w600,
                  color: valueColor ?? AppColors.onSurface,
                ),
        ),
      ],
    );
  }
}

class CheckInFailureScreen extends StatelessWidget {
  final GymModel gym;
  final String reason;
  const CheckInFailureScreen({
    super.key,
    required this.gym,
    required this.reason,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey'),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  color: AppColors.errorContainer,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.error_outline_rounded,
                  color: AppColors.error,
                  size: 54,
                ),
              ),
              const SizedBox(height: 28),
              Text('Check-in Failed', style: AppTextStyles.headlineXL),
              const SizedBox(height: 8),
              Text(
                'We could not validate your access at ${gym.name}.',
                style: AppTextStyles.bodyMD.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainerLow,
                  borderRadius: BorderRadius.circular(14),
                  border: const Border(
                    left: BorderSide(color: AppColors.error, width: 4),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'REASON',
                      style: AppTextStyles.labelSM.copyWith(
                        color: AppColors.error,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      reason,
                      style: AppTextStyles.labelMD.copyWith(
                        color: AppColors.onSurface,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              GKButton(label: 'Try Again', onTap: () => Navigator.pop(context)),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () =>
                    Navigator.pushNamed(context, AppRoutes.subscription),
                child: Text(
                  'Upgrade Plan',
                  style: AppTextStyles.bodyMD.copyWith(
                    color: AppColors.secondary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 18 — FIND GYM SCREEN (list + map)
// ═══════════════════════════════════════════════════════════════════════════

class FindGymScreen extends StatefulWidget {
  const FindGymScreen({super.key});

  @override
  State<FindGymScreen> createState() => _FindGymState();
}

class _FindGymState extends State<FindGymScreen> {
  bool _mapView = false;
  late Future<List<GymModel>> _future;
  String _filter = 'All';
  String _search = '';
  final _searchCtrl = TextEditingController();
  final _filters = ['All', 'Yoga', 'HIIT', 'Strength', 'Boxing', 'Spin'];

  @override
  void initState() {
    super.initState();
    _future = const ApiService().getGyms();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _refresh() async {
    await AuthManager().fetchLocation();
    setState(() => _future = const ApiService().getGyms());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey'),
      body: Column(
        children: [
          // ── Top Controls ─────────────────────────────────────────────────
          Container(
            color: AppColors.background,
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
            child: Column(
              children: [
                // Location bar
                ValueListenableBuilder<bool>(
                  valueListenable: AuthManager().locationNotifier,
                  builder: (_, __, ___) => Row(
                    children: [
                      const Icon(
                        Icons.person_pin_circle_outlined,
                        size: 22,
                        color: AppColors.secondary,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'YOUR LOCATION',
                              style: AppTextStyles.labelSM.copyWith(
                                fontSize: 10,
                                letterSpacing: 1.5,
                                color: AppColors.onSurfaceVariant,
                              ),
                            ),
                            Text(
                              AuthManager().address,
                              style: AppTextStyles.labelMD.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),

                // Search field
                TextField(
                  controller: _searchCtrl,
                  onChanged: (v) => setState(() => _search = v.toLowerCase()),
                  decoration: const InputDecoration(
                    hintText: 'Search studios, gyms…',
                    prefixIcon: Icon(Icons.search, color: AppColors.outline),
                  ),
                ),
                const SizedBox(height: 12),

                // Map / List toggle
                Row(
                  children: [
                    Expanded(child: _toggle('Map', Icons.map_outlined, true)),
                    const SizedBox(width: 10),
                    Expanded(child: _toggle('List', Icons.list, false)),
                  ],
                ),
                const SizedBox(height: 12),

                // Filters
                SizedBox(
                  height: 36,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _filters.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (_, i) {
                      final sel = _filter == _filters[i];
                      return GestureDetector(
                        onTap: () => setState(() => _filter = _filters[i]),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: sel
                                ? AppColors.primaryContainer
                                : AppColors.surfaceContainerHigh,
                            borderRadius: BorderRadius.circular(99),
                            border: sel
                                ? null
                                : Border.all(color: AppColors.outlineVariant),
                          ),
                          child: Text(
                            _filters[i],
                            style: AppTextStyles.labelMD.copyWith(
                              color: sel
                                  ? Colors.white
                                  : AppColors.onSurfaceVariant,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),

          // ── Content ──────────────────────────────────────────────────────
          Expanded(
            child: FutureBuilder<List<GymModel>>(
              future: _future,
              builder: (_, snap) {
                if (snap.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(
                      color: AppColors.secondary,
                    ),
                  );
                }
                var gyms = snap.data ?? [];
                if (_search.isNotEmpty) {
                  gyms = gyms
                      .where(
                        (g) =>
                            g.name.toLowerCase().contains(_search) ||
                            g.city.toLowerCase().contains(_search),
                      )
                      .toList();
                }
                if (gyms.isEmpty) {
                  return Center(
                    child: Text(
                      'No gyms found.',
                      style: AppTextStyles.bodyMD.copyWith(
                        color: AppColors.onSurfaceVariant,
                      ),
                    ),
                  );
                }
                if (_mapView) return _GymMap(gyms: gyms);
                return RefreshIndicator(
                  color: AppColors.secondary,
                  onRefresh: _refresh,
                  child: ListView.separated(
                    padding: const EdgeInsets.fromLTRB(20, 4, 20, 100),
                    itemCount: gyms.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (_, i) => GymCard(gym: gyms[i], compact: true),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _toggle(String label, IconData icon, bool isMap) {
    final sel = _mapView == isMap;
    return GestureDetector(
      onTap: () => setState(() => _mapView = isMap),
      child: Container(
        height: 44,
        decoration: BoxDecoration(
          color: sel
              ? AppColors.primaryContainer
              : AppColors.surfaceContainerHigh,
          borderRadius: BorderRadius.circular(10),
        ),
        alignment: Alignment.center,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 16,
              color: sel ? Colors.white : AppColors.onSurfaceVariant,
            ),
            const SizedBox(width: 6),
            Text(
              '$label View',
              style: AppTextStyles.labelMD.copyWith(
                color: sel ? Colors.white : AppColors.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GymMap extends StatefulWidget {
  final List<GymModel> gyms;
  const _GymMap({required this.gyms});

  @override
  State<_GymMap> createState() => _GymMapState();
}

class _GymMapState extends State<_GymMap> {
  late fm.MapController _mc;
  latlng.LatLng _center = const latlng.LatLng(33.741, 72.785);

  @override
  void initState() {
    super.initState();
    _mc = fm.MapController();
    final loc = AuthManager().location;
    if (loc != null) _center = latlng.LatLng(loc.latitude, loc.longitude);
  }

  @override
  Widget build(BuildContext context) {
    return fm.FlutterMap(
      mapController: _mc,
      options: fm.MapOptions(
        initialCenter: _center,
        initialZoom: 13,
        maxZoom: 18,
        minZoom: 4,
      ),
      children: [
        fm.TileLayer(
          urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: const ['a', 'b', 'c'],
          userAgentPackageName: 'com.gymkey.app',
        ),
        fm.MarkerLayer(
          markers: [
            fm.Marker(
              point: _center,
              width: 50,
              height: 50,
              child: Container(
                decoration: BoxDecoration(
                  color: AppColors.secondary,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2.5),
                ),
                child: const Icon(Icons.person, color: Colors.white, size: 22),
              ),
            ),
            ...widget.gyms.map(
              (g) => fm.Marker(
                point: latlng.LatLng(g.latitude, g.longitude),
                width: 44,
                height: 44,
                child: GestureDetector(
                  onTap: () => _showGymSheet(context, g),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.primaryContainer,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                    child: const Icon(
                      Icons.fitness_center,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  void _showGymSheet(BuildContext context, GymModel g) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (_) => Container(
        margin: const EdgeInsets.all(12),
        decoration: luxuryCard,
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(g.name, style: AppTextStyles.headlineMD),
            const SizedBox(height: 4),
            Text(
              g.address,
              style: AppTextStyles.bodyMD.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              '${g.distance.toStringAsFixed(1)} km away',
              style: AppTextStyles.labelSM.copyWith(
                color: AppColors.secondary,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 16),
            GKButton(
              label: 'View Details',
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(
                  context,
                  AppRoutes.gymDetails,
                  arguments: g,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 19 — GYM DETAIL SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class GymDetailScreen extends StatelessWidget {
  final GymModel gym;
  const GymDetailScreen({super.key, required this.gym});

  @override
  Widget build(BuildContext context) {
    final isPremium = gym.tier >= 2;
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: GestureDetector(
          onTap: () => Navigator.pop(context),
          child: Container(
            margin: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.black.withOpacity(0.4),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.arrow_back, color: Colors.white),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero
            Stack(
              children: [
                SizedBox(
                  height: 320,
                  width: double.infinity,
                  child: Image.network(
                    gym.coverImageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(
                      height: 320,
                      color: AppColors.surfaceContainerHigh,
                    ),
                  ),
                ),
                Container(
                  height: 320,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Color(0xEE0D0300)],
                      stops: [0.4, 1.0],
                    ),
                  ),
                ),
                Positioned(
                  bottom: 20,
                  left: 20,
                  right: 20,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          _badge(
                            gym.planLabel.toUpperCase() + ' GYM',
                            isPremium
                                ? AppColors.secondary
                                : AppColors.primaryContainer,
                          ),
                          const SizedBox(width: 8),
                          _badge('★ 4.9', Colors.white.withOpacity(0.2)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Text(
                        gym.name,
                        style: const TextStyle(
                          fontFamily: 'Inter',
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w800,
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_outlined,
                            color: Colors.white70,
                            size: 15,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              gym.address,
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),

            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats
                  Row(
                    children: [
                      Expanded(
                        child: _stat(
                          '${gym.distance.toStringAsFixed(1)} km',
                          'Distance',
                          Icons.near_me_rounded,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _stat(gym.planLabel, 'Tier', Icons.star_rounded),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _stat(
                          gym.is24Hours ? '24h' : 'Open',
                          'Status',
                          Icons.access_time_rounded,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  if (gym.description.isNotEmpty) ...[
                    Text('About', style: AppTextStyles.headlineMD),
                    const SizedBox(height: 8),
                    Text(
                      gym.description,
                      style: AppTextStyles.bodyMD.copyWith(
                        color: AppColors.onSurfaceVariant,
                        height: 1.6,
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Hours
                  Text('Operating Hours', style: AppTextStyles.headlineMD),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.access_time_rounded,
                          color: AppColors.secondary,
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          gym.hoursDisplay,
                          style: AppTextStyles.bodyMD.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),

                  if (gym.phoneNumber != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surfaceContainerLow,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.phone_outlined,
                            color: AppColors.secondary,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            gym.phoneNumber!,
                            style: AppTextStyles.bodyMD.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],

                  // Photo gallery
                  if (gym.photos.length > 1) ...[
                    const SizedBox(height: 24),
                    Text('Gallery', style: AppTextStyles.headlineMD),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 110,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: gym.photos.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 10),
                        itemBuilder: (_, i) => ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Image.network(
                            gym.photos[i],
                            width: 140,
                            height: 110,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              width: 140,
                              height: 110,
                              color: AppColors.surfaceContainerHigh,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],

                  const SizedBox(height: 32),
                  GKButton(
                    label: 'Check In at This Gym',
                    icon: Icons.qr_code_scanner,
                    onTap: () {
                      Navigator.pop(context);
                      // Navigate to check-in tab
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _badge(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontFamily: 'Inter',
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.5,
        ),
      ),
    );
  }

  Widget _stat(String value, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: AppColors.secondary, size: 18),
          const SizedBox(height: 6),
          Text(
            value,
            style: AppTextStyles.labelMD.copyWith(
              fontWeight: FontWeight.w700,
              color: AppColors.primary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          Text(
            label,
            style: AppTextStyles.labelSM.copyWith(fontWeight: FontWeight.w400),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 20 — PROFILE SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<bool>(
      valueListenable: AuthManager().authNotifier,
      builder: (_, __, ___) {
        final user = AuthManager().user;
        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: const GKAppBar(title: 'GymKey'),
          body: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar header
                Center(
                  child: Column(
                    children: [
                      Stack(
                        children: [
                          CircleAvatar(
                            radius: 54,
                            backgroundColor: AppColors.primaryContainer,
                            child: Text(
                              user?.initials ?? 'U',
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 42,
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            right: 0,
                            child: Container(
                              width: 34,
                              height: 34,
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: AppColors.background,
                                  width: 2.5,
                                ),
                              ),
                              child: const Icon(
                                Icons.edit,
                                size: 16,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        user?.name ?? 'Guest',
                        style: AppTextStyles.headlineMD,
                      ),
                      const SizedBox(height: 6),
                      if (user?.hasActivePlan == true)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.secondaryContainer,
                            borderRadius: BorderRadius.circular(99),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.workspace_premium_rounded,
                                size: 14,
                                color: AppColors.onSecondaryContainer,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                user!.membershipTier!,
                                style: AppTextStyles.labelSM.copyWith(
                                  color: AppColors.onSecondaryContainer,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        Text(
                          user?.email ?? '',
                          style: AppTextStyles.bodyMD.copyWith(
                            color: AppColors.onSurfaceVariant,
                          ),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 28),

                // Membership card
                _membershipCard(context, user),

                const SizedBox(height: 24),
                Text(
                  'Account',
                  style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
                ),
                const SizedBox(height: 12),
                _infoTile(Icons.mail_outline, 'Email', user?.email ?? 'N/A'),
                _infoTile(
                  Icons.phone_outlined,
                  'Phone',
                  user?.phone ?? 'Not added',
                ),
                _infoTile(Icons.badge_outlined, 'Role', user?.role ?? 'user'),
                _infoTile(
                  Icons.calendar_today_outlined,
                  'Member Since',
                  user?.formattedJoinDate ?? 'N/A',
                ),

                const SizedBox(height: 24),
                Text(
                  'Activity',
                  style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
                ),
                const SizedBox(height: 12),

                _menuTile(
                  context,
                  Icons.history,
                  'Check-in History',
                  () => Navigator.pushNamed(context, AppRoutes.checkInHistory),
                ),
                _menuTile(
                  context,
                  Icons.subscriptions_outlined,
                  'Manage Subscription',
                  () => Navigator.pushNamed(context, AppRoutes.subscription),
                ),
                _menuTile(
                  context,
                  Icons.auto_awesome,
                  'AI Fitness Onboarding',
                  () => Navigator.pushNamed(context, AppRoutes.aiOnboarding),
                ),
                _menuTile(
                  context,
                  Icons.notifications_outlined,
                  'Notifications',
                  () => Navigator.pushNamed(context, AppRoutes.notifications),
                ),

                const SizedBox(height: 16),
                const Divider(color: AppColors.outlineVariant),
                const SizedBox(height: 16),

                GestureDetector(
                  onTap: () {
                    AuthManager().logout();
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      AppRoutes.auth,
                      (r) => false,
                    );
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.errorContainer.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: AppColors.error.withOpacity(0.25),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.logout_rounded,
                          color: AppColors.error,
                          size: 20,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Sign Out',
                          style: AppTextStyles.labelMD.copyWith(
                            color: AppColors.error,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _membershipCard(BuildContext context, UserModel? user) {
    final active = user?.hasActivePlan == true;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: active ? AppColors.successContainer : AppColors.warningContainer,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: active ? const Color(0xFF4ADE80) : const Color(0xFFFBBF24),
        ),
      ),
      child: Row(
        children: [
          Icon(
            active ? Icons.verified_rounded : Icons.warning_amber_rounded,
            color: active ? AppColors.success : AppColors.warning,
            size: 28,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  active ? 'Active Subscription' : 'No Active Subscription',
                  style: AppTextStyles.labelMD.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  active ? user!.membershipTier! : 'Upgrade to access gyms',
                  style: AppTextStyles.labelSM.copyWith(
                    color: AppColors.onSurfaceVariant,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ],
            ),
          ),
          if (!active)
            GestureDetector(
              onTap: () => Navigator.pushNamed(context, AppRoutes.subscription),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 7,
                ),
                decoration: BoxDecoration(
                  color: AppColors.warning,
                  borderRadius: BorderRadius.circular(99),
                ),
                child: const Text(
                  'Upgrade',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _infoTile(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppColors.secondary),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: AppTextStyles.labelSM.copyWith(
                  color: AppColors.onSurfaceVariant,
                  fontWeight: FontWeight.w400,
                ),
              ),
              Text(
                value,
                style: AppTextStyles.bodyMD.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _menuTile(
    BuildContext context,
    IconData icon,
    String title,
    VoidCallback onTap,
  ) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
          child: Row(
            children: [
              Icon(icon, size: 20, color: AppColors.onSurfaceVariant),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  title,
                  style: AppTextStyles.bodyMD.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const Icon(
                Icons.chevron_right,
                size: 20,
                color: AppColors.outline,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 21 — SUBSCRIPTION SCREEN
// ═══════════════════════════════════════════════════════════════════════════

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionState();
}

class _SubscriptionState extends State<SubscriptionScreen> {
  late Future<List<SubscriptionPlanModel>> _future;

  @override
  void initState() {
    super.initState();
    _future = const ApiService().getPlans();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey', showBack: true),
      body: FutureBuilder<List<SubscriptionPlanModel>>(
        future: _future,
        builder: (_, snap) {
          if (snap.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppColors.secondary),
            );
          }
          if (snap.hasError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.wifi_off_outlined,
                    color: AppColors.outline,
                    size: 48,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Could not load plans.',
                    style: AppTextStyles.bodyMD.copyWith(
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                  const SizedBox(height: 16),
                  GKButton(
                    label: 'Retry',
                    onTap: () =>
                        setState(() => _future = const ApiService().getPlans()),
                  ),
                ],
              ),
            );
          }
          final plans = snap.data ?? [];
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 60),
            children: [
              Text(
                'Elevate Your Training',
                style: AppTextStyles.headlineXL,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                'Select the plan that fits your lifestyle.',
                style: AppTextStyles.bodyMD.copyWith(
                  color: AppColors.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 28),
              ...plans.map(
                (p) => _PlanCard(
                  plan: p,
                  onSuccess: () {
                    Navigator.pushNamedAndRemoveUntil(
                      context,
                      AppRoutes.home,
                      (r) => false,
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _PlanCard extends StatefulWidget {
  final SubscriptionPlanModel plan;
  final VoidCallback onSuccess;
  const _PlanCard({required this.plan, required this.onSuccess});

  @override
  State<_PlanCard> createState() => _PlanCardState();
}

class _PlanCardState extends State<_PlanCard> {
  bool _loading = false;

  Future<void> _subscribe() async {
    setState(() => _loading = true);
    try {
      // Uses stripePriceId as the priceId sent to backend
      final url = await const ApiService().createCheckoutSession(
        widget.plan.stripePriceId,
      );
      if (mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) =>
                CheckoutWebView(url: url, onSuccess: widget.onSuccess),
          ),
        );
      }
    } catch (e) {
      if (mounted)
        showError(context, e.toString().replaceAll('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.plan;
    final color = planTierColor(p.accessTier);
    final featured = p.isFeatured || p.accessTier == 2;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        decoration: BoxDecoration(
          color: featured
              ? AppColors.primaryContainer
              : AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: featured ? AppColors.secondary : AppColors.outlineVariant,
            width: featured ? 2 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: featured
                  ? AppColors.primaryContainer.withOpacity(0.3)
                  : const Color(0x0C2C1A0E),
              blurRadius: 20,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (featured)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: const BoxDecoration(
                  color: AppColors.secondary,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(18),
                    topRight: Radius.circular(18),
                  ),
                ),
                alignment: Alignment.center,
                child: const Text(
                  'BEST VALUE',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    p.tierName.toUpperCase(),
                    style: AppTextStyles.labelSM.copyWith(
                      color: featured
                          ? AppColors.onPrimaryContainer
                          : AppColors.onSurfaceVariant,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        'Rs. ${p.displayPrice}',
                        style: AppTextStyles.headlineXL.copyWith(
                          color: featured ? Colors.white : AppColors.primary,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 4, left: 6),
                        child: Text(
                          '/ ${p.interval}',
                          style: AppTextStyles.bodyMD.copyWith(
                            color: featured
                                ? Colors.white60
                                : AppColors.onSurfaceVariant,
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (p.description.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(
                      p.description,
                      style: AppTextStyles.bodyMD.copyWith(
                        color: featured
                            ? Colors.white70
                            : AppColors.onSurfaceVariant,
                      ),
                    ),
                  ],
                  if (p.features.isNotEmpty) ...[
                    const SizedBox(height: 14),
                    ...p.features.map(
                      (f) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Icon(
                              Icons.check_circle_rounded,
                              size: 16,
                              color: featured
                                  ? AppColors.secondaryContainer
                                  : color,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                f,
                                style: AppTextStyles.bodyMD.copyWith(
                                  color: featured
                                      ? Colors.white
                                      : AppColors.onSurface,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 16),
                  GKButton(
                    label: 'Subscribe — Rs. ${p.displayPrice}',
                    loading: _loading,
                    onTap: _subscribe,
                    bg: featured
                        ? AppColors.secondary
                        : AppColors.primaryContainer,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 22 — STRIPE CHECKOUT WEBVIEW
// ═══════════════════════════════════════════════════════════════════════════

class CheckoutWebView extends StatefulWidget {
  final String url;
  final VoidCallback onSuccess;
  const CheckoutWebView({
    super.key,
    required this.url,
    required this.onSuccess,
  });

  @override
  State<CheckoutWebView> createState() => _CheckoutWebViewState();
}

class _CheckoutWebViewState extends State<CheckoutWebView> {
  bool _loading = true;
  late WebViewController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() => _loading = true),
          onPageFinished: (url) {
            setState(() => _loading = false);
            if (url.startsWith(AppConfig.stripeSuccessBase)) {
              _handleSuccess();
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  Future<void> _handleSuccess() async {
    Navigator.pop(context);
    await Future.delayed(const Duration(milliseconds: 400));
    // Refresh user profile to get new subscription
    final tok = AuthManager().token;
    if (tok == null) return;
    try {
      final status = await const ApiService().getSubscriptionStatus();
      if (status['hasActiveSubscription'] == true && mounted) {
        showSuccess(
          context,
          'Subscription activated: ${status['activePlan'] ?? 'Active'}',
        );
        // Reload user profile
        final profile = await const ApiService().getProfile(tok);
        AuthManager().updateUser(UserModel.fromJson(profile));
        widget.onSuccess();
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primaryContainer,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Secure Checkout',
          style: TextStyle(
            fontFamily: 'Inter',
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Row(
              children: [
                Icon(Icons.lock, color: Colors.white70, size: 16),
                SizedBox(width: 4),
                Text(
                  'SSL',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    color: Colors.white70,
                    fontSize: 12,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _ctrl),
          if (_loading)
            Container(
              color: AppColors.background,
              child: const Center(
                child: CircularProgressIndicator(color: AppColors.secondary),
              ),
            ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 23 — NOTIFICATIONS SCREEN
// PLACEHOLDER: Backend endpoint GET /api/members/notifications not yet built.
// Mock data ready — swap FakeNotifService.load() with ApiService().getNotifications()
// ═══════════════════════════════════════════════════════════════════════════

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  // TODO: Replace with ApiService().getNotifications() when backend is ready
  static final _mockNotifs = [
    _NotifItem(
      icon: Icons.fitness_center,
      title: 'Class Starting Soon',
      body: 'Your "Advanced Power Yoga" starts in 30 minutes.',
      time: '12m ago',
      isUnread: true,
      type: 'class',
    ),
    _NotifItem(
      icon: Icons.workspace_premium,
      title: 'Subscription Renewed',
      body: 'Your Premium plan has been renewed for another month.',
      time: '2h ago',
      isUnread: true,
      type: 'payment',
    ),
    _NotifItem(
      icon: Icons.local_offer_outlined,
      title: 'New Studio Added',
      body: 'Iron & Ember Studio is now available in your area.',
      time: '1d ago',
      isUnread: false,
      type: 'gym',
    ),
    _NotifItem(
      icon: Icons.bolt,
      title: '7-Day Streak! 🔥',
      body: 'Incredible — you\'ve maintained a 7-day workout streak.',
      time: '2d ago',
      isUnread: false,
      type: 'streak',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final today = _mockNotifs.where((n) => n.isUnread).toList();
    final earlier = _mockNotifs.where((n) => !n.isUnread).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: GKAppBar(
        title: 'GymKey',
        showBack: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: TextButton(
              onPressed: () {},
              child: Text(
                'Mark all read',
                style: AppTextStyles.labelMD.copyWith(color: Colors.white),
              ),
            ),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 60),
        children: [
          Text('Notifications', style: AppTextStyles.headlineXL),
          const SizedBox(height: 20),
          if (today.isNotEmpty) ...[
            Text(
              'Today',
              style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 12),
            ...today.map((n) => _NotifCard(n: n)),
            const SizedBox(height: 20),
          ],
          if (earlier.isNotEmpty) ...[
            Text(
              'Earlier',
              style: AppTextStyles.headlineMD.copyWith(fontSize: 16),
            ),
            const SizedBox(height: 12),
            ...earlier.map((n) => _NotifCard(n: n)),
          ],
        ],
      ),
    );
  }
}

class _NotifItem {
  final IconData icon;
  final String title, body, time, type;
  final bool isUnread;
  const _NotifItem({
    required this.icon,
    required this.title,
    required this.body,
    required this.time,
    required this.isUnread,
    required this.type,
  });
}

class _NotifCard extends StatelessWidget {
  final _NotifItem n;
  const _NotifCard({super.key, required this.n});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLowest,
          borderRadius: BorderRadius.circular(14),
          border: n.isUnread
              ? const Border(
                  left: BorderSide(color: AppColors.secondary, width: 3),
                  top: BorderSide(color: AppColors.surfaceContainer),
                  right: BorderSide(color: AppColors.surfaceContainer),
                  bottom: BorderSide(color: AppColors.surfaceContainer),
                )
              : Border.all(color: AppColors.outlineVariant),
          boxShadow: const [
            BoxShadow(
              color: Color(0x082C1A0E),
              blurRadius: 16,
              offset: Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.secondaryContainer,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  n.icon,
                  color: AppColors.onSecondaryContainer,
                  size: 22,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            n.title,
                            style: AppTextStyles.labelMD.copyWith(
                              fontWeight: FontWeight.w700,
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                        Text(
                          n.time,
                          style: AppTextStyles.labelSM.copyWith(
                            color: AppColors.outline,
                            fontWeight: FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      n.body,
                      style: AppTextStyles.bodyMD.copyWith(
                        fontSize: 14,
                        color: AppColors.onSurfaceVariant,
                        height: 1.45,
                      ),
                    ),
                    if (n.isUnread) ...[
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.secondaryContainer,
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: Text(
                          'NEW',
                          style: AppTextStyles.labelSM.copyWith(
                            color: AppColors.onSecondaryContainer,
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 24 — CHECK-IN HISTORY SCREEN
// PLACEHOLDER: Real endpoint GET /api/members/checkins not yet implemented.
// ApiService.getCheckInHistory() returns mock data — swap when backend ready.
// ═══════════════════════════════════════════════════════════════════════════

class CheckInHistoryScreen extends StatefulWidget {
  const CheckInHistoryScreen({super.key});

  @override
  State<CheckInHistoryScreen> createState() => _CheckInHistoryState();
}

class _CheckInHistoryState extends State<CheckInHistoryScreen> {
  late Future<List<CheckInRecord>> _future;

  @override
  void initState() {
    super.initState();
    _future = const ApiService().getCheckInHistory();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey', showBack: true),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Check-in History', style: AppTextStyles.headlineXL),
                const SizedBox(height: 4),
                Text(
                  'Your recent studio visits.',
                  style: AppTextStyles.bodyMD.copyWith(
                    color: AppColors.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
          Expanded(
            child: FutureBuilder<List<CheckInRecord>>(
              future: _future,
              builder: (_, snap) {
                if (snap.connectionState == ConnectionState.waiting) {
                  return ListView(
                    padding: const EdgeInsets.all(20),
                    children: List.generate(
                      4,
                      (_) => Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: SkeletonBox(
                          width: double.infinity,
                          height: 80,
                          radius: 14,
                        ),
                      ),
                    ),
                  );
                }
                final records = snap.data ?? [];
                if (records.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.history,
                          color: AppColors.outline,
                          size: 48,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No check-ins yet.',
                          style: AppTextStyles.bodyMD.copyWith(
                            color: AppColors.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  );
                }
                return RefreshIndicator(
                  color: AppColors.secondary,
                  onRefresh: () async => setState(
                    () => _future = const ApiService().getCheckInHistory(),
                  ),
                  child: ListView.separated(
                    padding: const EdgeInsets.fromLTRB(20, 0, 20, 60),
                    itemCount: records.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 10),
                    itemBuilder: (_, i) => _HistoryCard(record: records[i]),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _HistoryCard extends StatelessWidget {
  final CheckInRecord record;
  const _HistoryCard({required this.record});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLowest,
        borderRadius: BorderRadius.circular(14),
        border: const Border(
          left: BorderSide(color: AppColors.secondary, width: 3),
          top: BorderSide(color: AppColors.surfaceContainer),
          right: BorderSide(color: AppColors.surfaceContainer),
          bottom: BorderSide(color: AppColors.surfaceContainer),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x082C1A0E),
            blurRadius: 12,
            offset: Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: Image.network(
              record.gymImageUrl,
              width: 52,
              height: 52,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => Container(
                width: 52,
                height: 52,
                color: AppColors.surfaceContainerHigh,
                child: const Icon(
                  Icons.fitness_center,
                  color: AppColors.outline,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  record.gymName,
                  style: AppTextStyles.labelMD.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 3),
                Text(
                  record.formattedDate,
                  style: AppTextStyles.labelSM.copyWith(
                    fontWeight: FontWeight.w400,
                    color: AppColors.onSurfaceVariant,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.secondaryContainer,
              borderRadius: BorderRadius.circular(99),
            ),
            child: const Icon(
              Icons.check_circle_rounded,
              color: AppColors.onSecondaryContainer,
              size: 16,
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 25 — AI ONBOARDING SCREEN (PLACEHOLDER)
// No backend AI endpoint. Future: POST /api/ai/onboarding
// ═══════════════════════════════════════════════════════════════════════════

class AIOnboardingScreen extends StatefulWidget {
  const AIOnboardingScreen({super.key});

  @override
  State<AIOnboardingScreen> createState() => _AIOnboardingState();
}

class _AIOnboardingState extends State<AIOnboardingScreen> {
  final _goals = {
    'Weight Loss',
    'Muscle Gain',
    'Endurance',
    'Flexibility',
    'General Wellness',
  };
  final _selected = <String>{};
  String _level = 'Intermediate';
  final _ageCtrl = TextEditingController(text: '28');
  final _heightCtrl = TextEditingController(text: '175');
  final _weightCtrl = TextEditingController(text: '75');
  bool _loading = false;

  @override
  void dispose() {
    _ageCtrl.dispose();
    _heightCtrl.dispose();
    _weightCtrl.dispose();
    super.dispose();
  }

  Future<void> _generate() async {
    setState(() => _loading = true);
    // TODO: POST /api/ai/onboarding { age, height, weight, goals, fitnessLevel }
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      setState(() => _loading = false);
      Navigator.pushReplacementNamed(context, AppRoutes.aiWorkout);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.primaryContainer,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'AI Fitness Setup',
          style: TextStyle(
            fontFamily: 'Inter',
            color: Colors.white,
            fontWeight: FontWeight.w600,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Define Your Journey', style: AppTextStyles.headlineXL),
            const SizedBox(height: 8),
            Text(
              'Tell us about yourself so our AI can curate a precision plan tailored to you.',
              style: AppTextStyles.bodyMD.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 28),

            // Metrics
            Row(
              children: [
                Expanded(child: _metricField('Age', 'yrs', _ageCtrl)),
                const SizedBox(width: 12),
                Expanded(child: _metricField('Height', 'cm', _heightCtrl)),
                const SizedBox(width: 12),
                Expanded(child: _metricField('Weight', 'kg', _weightCtrl)),
              ],
            ),
            const SizedBox(height: 24),

            Text('Your Goals', style: AppTextStyles.headlineMD),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _goals.map((g) {
                final sel = _selected.contains(g);
                return GestureDetector(
                  onTap: () => setState(
                    () => sel ? _selected.remove(g) : _selected.add(g),
                  ),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: sel
                          ? AppColors.primaryContainer
                          : AppColors.surfaceContainerHigh,
                      borderRadius: BorderRadius.circular(99),
                      border: sel
                          ? null
                          : Border.all(color: AppColors.outlineVariant),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (sel) ...[
                          const Icon(
                            Icons.check,
                            size: 14,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 6),
                        ],
                        Text(
                          g,
                          style: AppTextStyles.labelMD.copyWith(
                            color: sel
                                ? Colors.white
                                : AppColors.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            Text('Fitness Level', style: AppTextStyles.headlineMD),
            const SizedBox(height: 12),
            ...['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(
              (l) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: GestureDetector(
                  onTap: () => setState(() => _level = l),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: _level == l
                          ? AppColors.primaryContainer.withOpacity(0.08)
                          : AppColors.surfaceContainerLow,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: _level == l
                            ? AppColors.primaryContainer
                            : AppColors.outlineVariant,
                        width: _level == l ? 2 : 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 20,
                          height: 20,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: _level == l
                                  ? AppColors.secondary
                                  : AppColors.outline,
                              width: 2,
                            ),
                            color: _level == l
                                ? AppColors.secondary
                                : Colors.transparent,
                          ),
                          child: _level == l
                              ? const Icon(
                                  Icons.check,
                                  size: 12,
                                  color: Colors.white,
                                )
                              : null,
                        ),
                        const SizedBox(width: 12),
                        Text(
                          l,
                          style: AppTextStyles.bodyMD.copyWith(
                            fontWeight: FontWeight.w500,
                            color: _level == l
                                ? AppColors.primaryContainer
                                : AppColors.onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),

            GKButton(
              label: 'Generate My AI Plan',
              loading: _loading,
              icon: Icons.auto_awesome,
              onTap: _generate,
            ),
          ],
        ),
      ),
    );
  }

  Widget _metricField(String label, String unit, TextEditingController ctrl) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTextStyles.labelMD.copyWith(
            color: AppColors.onSurfaceVariant,
          ),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: ctrl,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: '—',
            suffixText: unit,
            suffixStyle: AppTextStyles.labelSM.copyWith(
              color: AppColors.outline,
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 14,
            ),
          ),
        ),
      ],
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 26 — AI WORKOUT SCREEN (PLACEHOLDER)
// Future: GET /api/ai/workout-plan
// ═══════════════════════════════════════════════════════════════════════════

class AIWorkoutScreen extends StatelessWidget {
  const AIWorkoutScreen({super.key});

  static final _workouts = [
    {
      'tag': 'TODAY\'S PICK',
      'title': 'Mobility Recovery',
      'sub': '35 min · Low intensity',
      'img':
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    },
    {
      'tag': 'DAY 2',
      'title': 'Upper Body Strength',
      'sub': '50 min · High intensity',
      'img':
          'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    },
    {
      'tag': 'DAY 3',
      'title': 'Zone 2 Cardio',
      'sub': '45 min · Moderate',
      'img':
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI insight card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppColors.secondaryContainer.withOpacity(0.5),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.auto_awesome,
                        color: AppColors.secondary,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'AI INSIGHTS',
                        style: AppTextStyles.labelSM.copyWith(
                          color: AppColors.secondary,
                          letterSpacing: 1.5,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Tailored for Your Peak',
                    style: AppTextStyles.headlineLG,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Based on your profile and recovery data, we recommend starting with mobility work to prevent injury and build a strong foundation.',
                    style: AppTextStyles.bodyMD.copyWith(
                      color: AppColors.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            Text('Your Weekly Plan', style: AppTextStyles.headlineMD),
            const SizedBox(height: 12),

            ..._workouts.map(
              (w) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Container(
                  decoration: luxuryCard,
                  clipBehavior: Clip.antiAlias,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Stack(
                        children: [
                          Image.network(
                            w['img']!,
                            height: 130,
                            width: double.infinity,
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) => Container(
                              height: 130,
                              color: AppColors.surfaceContainerHigh,
                            ),
                          ),
                          Container(
                            height: 130,
                            decoration: const BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [Colors.transparent, Color(0x882C1A0E)],
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 12,
                            left: 14,
                            child: Text(
                              w['tag']!,
                              style: AppTextStyles.labelSM.copyWith(
                                color: AppColors.secondaryContainer,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              w['title']!,
                              style: AppTextStyles.headlineMD.copyWith(
                                fontSize: 18,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              w['sub']!,
                              style: AppTextStyles.bodyMD.copyWith(
                                color: AppColors.onSurfaceVariant,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 12),
                            GKButton(label: 'Start Workout', onTap: () {}),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 27 — NUTRITION SCREEN (PLACEHOLDER)
// Future: GET /api/nutrition/today, POST /api/nutrition/log
// ═══════════════════════════════════════════════════════════════════════════

class NutritionScreen extends StatelessWidget {
  const NutritionScreen({super.key});

  static final _meals = [
    ['Breakfast', 'Overnight oats with berries', '420 kcal', '08:00 AM'],
    ['Lunch', 'Grilled salmon & quinoa bowl', '540 kcal', '12:30 PM'],
    ['Snack', 'Greek yogurt & almonds', '280 kcal', '04:00 PM'],
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: const GKAppBar(title: 'GymKey'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Nutrition', style: AppTextStyles.headlineXL),
            const SizedBox(height: 4),
            Text(
              'Track your daily intake and macros.',
              style: AppTextStyles.bodyMD.copyWith(
                color: AppColors.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),

            // Calorie ring
            Container(
              decoration: luxuryCard,
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Container(
                    width: 160,
                    height: 160,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.secondary, width: 14),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.secondary.withOpacity(0.15),
                          blurRadius: 20,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            '1,840',
                            style: AppTextStyles.headlineXL.copyWith(
                              fontSize: 30,
                            ),
                          ),
                          Text(
                            'kcal left',
                            style: AppTextStyles.labelSM.copyWith(
                              fontWeight: FontWeight.w400,
                              color: AppColors.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _cStat('Consumed', '660 kcal', AppColors.primary),
                      Container(
                        width: 1,
                        height: 40,
                        color: AppColors.outlineVariant,
                      ),
                      _cStat('Goal', '2,500 kcal', AppColors.outline),
                      Container(
                        width: 1,
                        height: 40,
                        color: AppColors.outlineVariant,
                      ),
                      _cStat('Burned', '320 kcal', AppColors.secondary),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Macros
            Row(
              children: [
                Expanded(
                  child: _macro('Protein', '142g', '200g', AppColors.secondary),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _macro(
                    'Carbs',
                    '65g',
                    '250g',
                    const Color(0xFF5B8CDB),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: _macro('Fats', '28g', '65g', const Color(0xFFB8862A)),
                ),
              ],
            ),
            const SizedBox(height: 24),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Today\'s Meals', style: AppTextStyles.headlineMD),
                GestureDetector(
                  onTap: () {},
                  child: Text(
                    '+ Add',
                    style: AppTextStyles.labelMD.copyWith(
                      color: AppColors.secondary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            ..._meals.map(
              (m) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Container(
                  decoration: luxuryCard,
                  padding: const EdgeInsets.all(14),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceContainerHigh,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.restaurant_menu_outlined,
                          color: AppColors.secondary,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              m[0],
                              style: AppTextStyles.labelSM.copyWith(
                                color: AppColors.secondary,
                                letterSpacing: 1.2,
                              ),
                            ),
                            Text(
                              m[1],
                              style: AppTextStyles.labelMD.copyWith(
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                            Text(
                              m[3],
                              style: AppTextStyles.labelSM.copyWith(
                                fontWeight: FontWeight.w400,
                                color: AppColors.outline,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        m[2],
                        style: AppTextStyles.labelMD.copyWith(
                          color: AppColors.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _cStat(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: AppTextStyles.headlineMD.copyWith(color: color, fontSize: 16),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: AppTextStyles.labelSM.copyWith(fontWeight: FontWeight.w400),
        ),
      ],
    );
  }

  Widget _macro(String name, String cur, String goal, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surfaceContainerLow,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            name,
            style: AppTextStyles.labelSM.copyWith(
              color: AppColors.onSurfaceVariant,
              fontWeight: FontWeight.w400,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            cur,
            style: AppTextStyles.headlineMD.copyWith(
              color: color,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            'of $goal',
            style: AppTextStyles.labelSM.copyWith(
              fontWeight: FontWeight.w400,
              color: AppColors.outline,
            ),
          ),
          const SizedBox(height: 8),
          // Mini progress bar
          ClipRRect(
            borderRadius: BorderRadius.circular(99),
            child: LinearProgressIndicator(
              value:
                  double.tryParse(cur.replaceAll(RegExp(r'[^0-9]'), ''))! /
                  double.parse(goal.replaceAll(RegExp(r'[^0-9]'), '')),
              backgroundColor: AppColors.surfaceContainerHigh,
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 5,
            ),
          ),
        ],
      ),
    );
  }
}
