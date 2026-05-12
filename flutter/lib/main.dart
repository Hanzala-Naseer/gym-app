import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:webview_flutter/webview_flutter.dart';
// import 'package:webview_flutter_android/webview_flutter_android.dart';

import 'package:flutter_map/flutter_map.dart' as fm;

import 'package:latlong2/latlong.dart' as latlng;
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
// ===========================================================================
// 1. CONFIGURATION & CONSTANTS
// ===========================================================================

class AppConfig {
  // IMPORTANT: Update this to your local machine's IP for actual testing
  // NOTE: This IP should match your API server location
  static const String baseUrl =
      'https://gymkey-backend-production.up.railway.app/api';
  static const String imageBaseUrl =
      'https://gymkey-backend-production.up.railway.app';
}

class AppRoutes {
  static const String splash = '/';
  static const String auth = '/auth';
  static const String home = '/home';
  static const String gymDetails = '/gym-details';
  static const String subscription = '/subscription';
}

// ===========================================================================
// 2. MODELS
// ===========================================================================

class User {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? membershipTier;
  final DateTime? createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.membershipTier,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    // -------- ACTIVE SUBSCRIPTION TIER --------
    String? currentTierName;
    final activeSub = json['activeSubscription'];
    if (activeSub != null && activeSub['tier'] != null) {
      currentTierName = activeSub['tier']['name']?.toString();
    }

    // -------- CREATED AT SAFE PARSE --------
    DateTime? createdAt;
    if (json['createdAt'] != null) {
      try {
        createdAt = DateTime.parse(json['createdAt']);
      } catch (_) {
        createdAt = null;
      }
    }

    return User(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      membershipTier: currentTierName,
      createdAt: createdAt,
    );
  }

  // -------- HELPER FOR UI --------
  String get formattedCreatedAt {
    if (createdAt == null) return "N/A";

    return "${createdAt!.day.toString().padLeft(2, '0')}-"
        "${createdAt!.month.toString().padLeft(2, '0')}-"
        "${createdAt!.year}";
  }
}

class Gym {
  final String id;
  final String name;
  final String address;
  final double latitude;
  final double longitude;
  final double distance;
  final String planType;
  final String imageUrl;
  final List<String> facilities;
  final Map<String, String> hours;

  Gym({
    required this.id,
    required this.name,
    required this.address,
    this.latitude = 0.0,
    this.longitude = 0.0,
    required this.distance,
    required this.planType,
    required this.imageUrl,
    this.facilities = const [],
    this.hours = const {},
  });

  factory Gym.fromJson(Map<String, dynamic> json) {
    String getPlanType(dynamic tier) {
      final tierInt = int.tryParse(tier?.toString() ?? '0') ?? 0;
      if (tierInt == 2) return 'Pro';
      if (tierInt >= 1) return 'Standard';
      return 'Standard';
    }

    String getFullImageUrl(String? path) {
      debugPrint('🟡 [ImageURL] Raw path from API: "$path"');

      if (path == null || path.trim().isEmpty) {
        debugPrint('⚠️ [ImageURL] Empty path → placeholder');
        return 'https://via.placeholder.com/150';
      }

      // 🔥 REMOVE ALL WHITESPACE (this is the real bug)
      final cleaned = path.replaceAll(RegExp(r'\s+'), '');

      debugPrint('🔧 [ImageURL] Cleaned path: "$cleaned"');

      // 🔥 IF FULL URL — JUST RETURN IT
      if (cleaned.startsWith('http')) {
        debugPrint('🟢 [ImageURL] Final URL (used directly): $cleaned');
        return cleaned;
      }

      // 🔥 HANDLE RELATIVE PATH
      final normalized = cleaned.startsWith('/')
          ? cleaned.substring(1)
          : cleaned;

      final fullUrl = normalized.startsWith('uploads/')
          ? '${AppConfig.imageBaseUrl}/$normalized'
          : '${AppConfig.imageBaseUrl}/uploads/$normalized';

      debugPrint('🟢 [ImageURL] Final URL (constructed): $fullUrl');
      return fullUrl;
    }

    // String getFullImageUrl(String? path) {
    //   if (path == null || path.isEmpty) {
    //     return 'https://via.placeholder.com/150';
    //   }
    //   if (path.startsWith('http')) return path;
    //   return AppConfig.imageBaseUrl + path;
    // }

    final double safeDistance = (json['distance'] is num)
        ? json['distance'].toDouble()
        : 0.0;

    List<String> parseFacilities(dynamic data) {
      if (data == null) return [];
      if (data is List) {
        return List<String>.from(data.whereType<String>());
      }
      try {
        // Attempt to parse a string representation of a JSON list
        final List<dynamic> list = convert.json.decode(data.toString());
        return list.map((e) => e.toString()).toList();
      } catch (_) {
        return [];
      }
    }

    return Gym(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      address: "${json['addressLine'] ?? ''}, ${json['city'] ?? ''}",
      imageUrl: getFullImageUrl(json['coverImageUrl']),

      latitude: (json['latitude'] is num) ? json['latitude'].toDouble() : 0.0,
      longitude: (json['longitude'] is num)
          ? json['longitude'].toDouble()
          : 0.0,
      distance: safeDistance,
      planType: getPlanType(json['tier']),

      facilities: parseFacilities(json['facilities']),
      hours: Map<String, String>.from(
        json['hours'] ?? {'Mon-Fri': '6AM - 10PM'},
      ),
    );
  }
}

class SubscriptionPlan {
  final String id;
  final String name;
  final int price; // cents
  final String interval;
  final int accessTier;
  final String description;
  final List<String> features;

  SubscriptionPlan({
    required this.id,
    required this.name,
    required this.price,
    required this.interval,
    required this.accessTier,
    required this.description,
    required this.features,
  });

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) {
    return SubscriptionPlan(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      price: json['price'] ?? 0,
      interval: json['interval'] ?? 'month',
      accessTier: json['accessTier'] ?? 1,
      description: json['description'] ?? '',
      features: List<String>.from(json['features'] ?? []),
    );
  }
}

// Helper function to map access tier to a consistent brand color
Color _getTierColor(int tier) {
  switch (tier) {
    case 1:
      return Colors.blue.shade600; // BASIC
    case 2:
      return const Color(0xFFC62828); // PREMIUM (Red/Maroon)
    case 3:
      return Colors.amber.shade700; // ULTIMATE (Yellow/Gold)
    default:
      return Colors.grey;
  }
}
// ===========================================================================
// 3. AUTH & STATE MANAGEMENT (Includes Location Data)
// ===========================================================================

class AuthManager {
  static final AuthManager _instance = AuthManager._internal();
  factory AuthManager() => _instance;
  AuthManager._internal();

  String? _authToken;
  User? _currentUser;
  final _storage = const FlutterSecureStorage();

  Position? _currentLocation;
  String _currentAddress = "Fetching location...";

  final ValueNotifier<bool> locationStatusNotifier = ValueNotifier(false);
  final ValueNotifier<bool> authStatusNotifier = ValueNotifier(false);

  bool get isAuthenticated => _authToken != null;
  User? get user => _currentUser;
  String? get token => _authToken;
  Position? get currentLocation => _currentLocation;
  String get currentAddress => _currentAddress;

  void setCurrentUser(User user) {
    _currentUser = user;
  }

  void setSession(String token, User user) {
    _authToken = token;
    _currentUser = user;
    _storage.write(key: 'jwt_token', value: token);
    authStatusNotifier.value = true;
    print('DEBUG: Session set successfully for user: ${user.name}');
  }

  Future<bool> loadSession() async {
    final storedToken = await _storage.read(key: 'jwt_token');
    if (storedToken != null) {
      try {
        final profile = await ApiService().getProfile(storedToken);
        final user = User.fromJson(profile);
        setSession(storedToken, user);
        return true;
      } catch (e) {
        print('DEBUG: Failed to load profile using stored token: $e');
        logout();
        return false;
      }
    }
    return false;
  }

  void logout() {
    _authToken = null;
    _currentUser = null;
    _storage.delete(key: 'jwt_token');
    authStatusNotifier.value = false;
    print('DEBUG: User logged out and session cleared.');
  }

  Future<void> fetchLocation() async {
    locationStatusNotifier.value = false;
    print('DEBUG: Starting location fetch...');
    try {
      // 1️⃣ Permissions (only meaningful on mobile)
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied ||
            permission == LocationPermission.deniedForever) {
          _currentAddress = "Location permissions denied.";
          print('DEBUG: Location permissions denied.');
          throw Exception(
            "Location permissions are denied or permanently denied.",
          );
        }
      }

      // 2️⃣ Get current position
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 10),
      );

      _currentLocation = position;
      print(
        'DEBUG: Raw position obtained: Lat ${position.latitude.toStringAsFixed(4)}, Lon ${position.longitude.toStringAsFixed(4)}',
      );

      // 3️⃣ Reverse geocoding
      if (kIsWeb) {
        // Web: Use OpenStreetMap Nominatim
        try {
          final url =
              'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.latitude}&lon=${position.longitude}';
          final response = await http.get(
            Uri.parse(url),
            headers: {'User-Agent': 'Flutter App'},
          );
          if (response.statusCode == 200) {
            final data = convert.jsonDecode(response.body);
            _currentAddress =
                data['display_name'] ??
                "Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
            print(
              'DEBUG: Address successfully decoded (Web): $_currentAddress',
            );
          } else {
            _currentAddress =
                "Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
            print(
              'DEBUG: Nominatim API failed with status ${response.statusCode}',
            );
          }
        } catch (e) {
          _currentAddress =
              "Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
          print('DEBUG: Web geocoding failed: $e');
        }
      } else {
        // Mobile: Use geocoding package
        try {
          final placemarks = await placemarkFromCoordinates(
            position.latitude,
            position.longitude,
          );
          if (placemarks.isNotEmpty) {
            final p = placemarks.first;
            _currentAddress = [
              p.street,
              p.locality,
              p.administrativeArea,
              p.country,
            ].where((s) => s != null && s.isNotEmpty).join(', ');
            print(
              'DEBUG: Address successfully decoded (Mobile): $_currentAddress',
            );
          } else {
            _currentAddress =
                "Address lookup failed. Coordinates: Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
            print('DEBUG: Placemarks list was empty.');
          }
        } catch (e) {
          _currentAddress =
              "Address lookup error. Coordinates: Lat: ${position.latitude.toStringAsFixed(4)}, Lon: ${position.longitude.toStringAsFixed(4)}";
          print('DEBUG: Mobile geocoding failed: $e');
        }
      }
    } catch (e) {
      if (e.toString().contains("Location permissions denied")) {
        _currentAddress = "Location access denied.";
      } else {
        _currentAddress = "Location service unavailable or timed out. $e";
      }
      _currentLocation = null;
      print('DEBUG: Geolocator failed with error: $e');
    } finally {
      locationStatusNotifier.value = true;
      print('DEBUG: Location fetch completed.');
    }
  }
}

// ===========================================================================
// 4. API SERVICE
// ===========================================================================

class ApiService {
  const ApiService();

  Map<String, String> _defaultHeader() {
    return {"Content-Type": "application/json"};
  }

  // Throws specific error for missing token
  Map<String, String> _authHeader() {
    final token = AuthManager().token;
    if (token == null) {
      // Throw a specific error format for FutureBuilder to catch
      throw const FormatException(
        "AUTH_TOKEN_MISSING: Authentication token is missing.",
      );
    }
    return {
      "Authorization": "Bearer $token",
      "Content-Type": "application/json",
    };
  }

  dynamic _handleResponse(http.Response response) {
    // Log the raw response for debugging purposes
    print("DEBUG: API Response Status: ${response.statusCode}");
    print(
      "DEBUG: API Response Body (start): ${response.body.substring(0, response.body.length.clamp(0, 500))} (end)",
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      // Check if the body is empty (e.g., 204 No Content)
      if (response.body.isEmpty) {
        return {};
      }
      // Attempt to decode JSON
      try {
        return convert.json.decode(response.body);
      } catch (e) {
        print("ERROR: Failed to decode JSON response: $e");
        throw Exception("Server returned invalid JSON format.");
      }
    } else {
      // Handle error status codes
      final body = response.body.isNotEmpty
          ? convert.json.decode(response.body)
          : {};

      final error =
          body["message"] ??
          body["error"] ??
          "Request failed with status ${response.statusCode}. Check server logs for details.";

      throw Exception(error);
    }
  }

  Future<bool> checkInGym({
    required String gymId,
    required String qrToken,
  }) async {
    print(
      'DEBUG: Attempting check-in for Gym ID $gymId with token $qrToken...',
    );

    // 🚨 Ensure this endpoint matches your backend API: POST /api/checkin/qr
    final response = await http.post(
      Uri.parse('${AppConfig.baseUrl}/checkin'),
      headers: _authHeader(),
      body: convert.json.encode({'gymId': gymId, 'qrToken': qrToken}),
    );

    // The handler will throw an Exception if status is not 2xx
    final responseBody = _handleResponse(response);

    // Assuming the server returns { "success": true, "message": "Checked in!" }
    // We return true if the request succeeded (2xx status) and the response body is non-error
    if (responseBody is Map<String, dynamic>) {
      return responseBody['success'] == true;
    }

    // If response is just a 204 No Content, it's successful
    return true;
  }

  // Auth Routes (using standard header)
  Future<Map<String, dynamic>> login(String email, String password) async {
    print('DEBUG: Attempting login for $email...');
    final response = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/login'),
      headers: _defaultHeader(),
      body: convert.json.encode({'email': email, 'password': password}),
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> register(
    String name,
    String email,
    String password,
  ) async {
    print('DEBUG: Attempting registration for $email...');
    final response = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/signup'),
      headers: _defaultHeader(),
      body: convert.json.encode({
        'name': name,
        'email': email,
        'password': password,
      }),
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> verifyOTP(String email, String otp) async {
    print('DEBUG: Attempting OTP verification for $email...');
    final response = await http.post(
      Uri.parse('${AppConfig.baseUrl}/auth/verify-otp'),
      headers: _defaultHeader(),
      body: convert.json.encode({'email': email, 'otp': otp}),
    );
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> getProfile(String token) async {
    print('DEBUG: Fetching user profile...');
    final response = await http.get(
      Uri.parse('${AppConfig.baseUrl}/members/profile'),
      headers: {"Authorization": "Bearer $token"},
    );
    return _handleResponse(response);
  }

  // App Routes (using authenticated header)
  // In ApiService class, replace the old getGyms function with this:

  Future<List<Gym>> getGyms() async {
    print('DEBUG: Fetching gyms...');
    final headers = _authHeader();
    final location = AuthManager().currentLocation;

    final Map<String, dynamic> queryParams = {};
    if (location != null) {
      queryParams['latitude'] = location.latitude.toString();
      queryParams['longitude'] = location.longitude.toString();
    }

    final uri = Uri.parse(
      '${AppConfig.baseUrl}/gyms',
    ).replace(queryParameters: queryParams);

    final response = await http.get(uri, headers: headers);

    final dynamic responseBody = _handleResponse(response);

    // FIX: Handle when server returns a List directly (less common but possible)
    if (responseBody is List) {
      print(
        'DEBUG: Successfully fetched ${responseBody.length} gyms (naked list).',
      );
      return responseBody.map((json) => Gym.fromJson(json)).toList();
    }

    // Handle when server returns Map with 'gyms' key (expected based on previous code)
    if (responseBody is Map<String, dynamic> &&
        responseBody.containsKey('gyms') &&
        responseBody['gyms'] is List) {
      final List<dynamic> jsonList = responseBody['gyms'] as List<dynamic>;
      print(
        'DEBUG: Successfully fetched ${jsonList.length} gyms (wrapped in "gyms" key).',
      );
      return jsonList.map((json) => Gym.fromJson(json)).toList();
    }

    // Fallback for invalid format
    print('DEBUG: Invalid gym list format in API response.');
    throw Exception(
      "Invalid gym list format from server. Expected a list or an object containing a 'gyms' list.",
    );
  }

  Future<List<SubscriptionPlan>> getPlans() async {
    final response = await http.get(
      Uri.parse('${AppConfig.baseUrl}/subscription/plans'),
    );

    print("PLANS STATUS: ${response.statusCode}");
    print("PLANS BODY: ${response.body}");

    if (response.statusCode != 200) {
      throw Exception("Failed to load plans");
    }

    final decoded = convert.jsonDecode(response.body);

    // ✅ SUPPORT BOTH BACKEND SHAPES
    final List<dynamic> jsonList = decoded is List ? decoded : decoded['plans'];

    // ✅ SORT BY BACKEND PRICE FIELD
    jsonList.sort((a, b) {
      final int priceA = a['price'] ?? 0;
      final int priceB = b['price'] ?? 0;
      return priceA.compareTo(priceB);
    });

    return jsonList.map((json) => SubscriptionPlan.fromJson(json)).toList();
  }
}

// ===========================================================================
// 5. MAIN APP ENTRY POINT & ROUTING
// ===========================================================================

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Ensure sessions and location are loaded before running the app
  await AuthManager().loadSession();
  await AuthManager().fetchLocation();
  runApp(const GymPassportApp());
}

class GymPassportApp extends StatelessWidget {
  const GymPassportApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gym Passport',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: const Color(0xFFC62828),
        scaffoldBackgroundColor: const Color(0xFFF5F5F5),
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFFC62828)),
        useMaterial3: true,
        fontFamily: 'Roboto',
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          surfaceTintColor: Colors.white,
          elevation: 0.5,
          centerTitle: true,
          iconTheme: IconThemeData(color: Colors.black),
          titleTextStyle: TextStyle(
            color: Colors.black,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      initialRoute: AppRoutes.splash,
      routes: {
        AppRoutes.splash: (context) => const SplashScreen(),
        AppRoutes.auth: (context) => const AuthScreen(),
        AppRoutes.home: (context) => const MainNavScreen(),
        AppRoutes.subscription: (context) => const SubscriptionScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == AppRoutes.gymDetails) {
          final gym = settings.arguments as Gym;
          return MaterialPageRoute(
            builder: (context) => GymDetailScreen(gym: gym),
          );
        }
        return null;
      },
    );
  }
}

// ===========================================================================
// 6. SCREENS (Layout Overflow Fixes & Error Handling)
// ===========================================================================

// --- SPLASH SCREEN ---
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Session and location are loaded in main, ensuring quick transition.
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted) {
        if (AuthManager().isAuthenticated) {
          Navigator.pushReplacementNamed(context, AppRoutes.home);
        } else {
          Navigator.pushReplacementNamed(context, AppRoutes.auth);
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: Color(0xFFC62828),
      body: Center(
        child: Text(
          "GYM-KEY",
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

// --- AUTH SCREEN (Calls register) ---
class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});
  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool isLogin = true;
  bool isLoading = false;
  final ApiService _api = const ApiService();

  // Pre-filled for development convenience
  final _emailCtrl = TextEditingController(text: 'hanzala@example.com');
  final _passCtrl = TextEditingController(text: 'password123');
  final _nameCtrl = TextEditingController(text: 'Hanzala Ali');

  Future<void> _submit() async {
    setState(() => isLoading = true);
    try {
      if (isLogin) {
        final response = await _api.login(_emailCtrl.text, _passCtrl.text);
        final token = response['token'];
        final user = User.fromJson(response['user'] ?? {});

        AuthManager().setSession(token, user);
        // Note: Actual API should return 'requiresVerification' flag
        if (response['requiresVerification'] == true) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => OTPScreen(email: _emailCtrl.text),
            ),
          );
        } else {
          Navigator.pushReplacementNamed(context, AppRoutes.home);
        }
      } else {
        // Calling the register function
        await _api.register(_nameCtrl.text, _emailCtrl.text, _passCtrl.text);
        // Assume successful registration leads to OTP screen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => OTPScreen(email: _emailCtrl.text),
          ),
        );
      }
    } catch (e) {
      print('DEBUG: Auth submit failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Auth Error: ${e.toString().replaceAll('Exception: ', '')}',
          ),
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Container(
            width: double.infinity,
            height: double.infinity,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: const NetworkImage(
                  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1470',
                ),
                fit: BoxFit.cover,
                colorFilter: const ColorFilter.mode(
                  Colors.black54,
                  BlendMode.darken,
                ),
              ),
            ),
          ),
          SafeArea(
            child: SingleChildScrollView(
              // FIX: Prevents vertical overflow on small screens/keyboard open
              padding: const EdgeInsets.all(24.0),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  // FIX: Ensures the column takes up at least the height of the screen minus padding,
                  // but allows it to grow if needed via SingleChildScrollView
                  minHeight:
                      MediaQuery.of(context).size.height -
                      MediaQuery.of(context).padding.top -
                      48,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment:
                      MainAxisAlignment.end, // Align content to the bottom
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildToggle(
                          "Login",
                          isLogin,
                          () => setState(() => isLogin = true),
                        ),
                        const SizedBox(width: 30),
                        _buildToggle(
                          "Sign Up",
                          !isLogin,
                          () => setState(() => isLogin = false),
                        ),
                      ],
                    ),
                    const SizedBox(height: 100), // Spacing pusher
                    Text(
                      isLogin ? "WELCOME BACK" : "HELLO ROOKIES",
                      style: const TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      "Enter your information below",
                      style: TextStyle(color: Colors.white70),
                    ),
                    const SizedBox(height: 30),
                    if (!isLogin) ...[
                      _buildInput(_nameCtrl, "Full Name", Icons.person_outline),
                      const SizedBox(height: 16),
                    ],
                    _buildInput(
                      _emailCtrl,
                      "Email",
                      Icons.email_outlined,
                      keyboardType: TextInputType.emailAddress,
                    ),
                    const SizedBox(height: 16),
                    _buildInput(
                      _passCtrl,
                      "Password",
                      Icons.lock_outline,
                      obscure: true,
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFC62828),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        onPressed: isLoading ? null : _submit,
                        child: isLoading
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : Text(
                                isLogin ? "Login >" : "Sign Up >",
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToggle(String text, bool active, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Text(
            text,
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: active ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          if (active)
            Container(
              height: 3,
              width: 40,
              color: const Color(0xFFC62828),
              margin: const EdgeInsets.only(top: 4),
            ),
        ],
      ),
    );
  }

  Widget _buildInput(
    TextEditingController ctrl,
    String hint,
    IconData icon, {
    bool obscure = false,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return TextField(
      controller: ctrl,
      obscureText: obscure,
      keyboardType: keyboardType,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.white54),
        filled: true,
        fillColor: Colors.white.withOpacity(0.1),
        prefixIcon: Icon(icon, color: Colors.white70),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}

// --- OTP SCREEN (Calls verifyOTP) ---
class OTPScreen extends StatefulWidget {
  final String email;
  const OTPScreen({required this.email, super.key});
  @override
  State<OTPScreen> createState() => _OTPScreenState();
}

class _OTPScreenState extends State<OTPScreen> {
  final _otpCtrl = TextEditingController();
  bool isLoading = false;
  final ApiService _api = const ApiService();

  Future<void> _verifyOTP() async {
    setState(() => isLoading = true);
    try {
      // Calling the verifyOTP function
      final response = await _api.verifyOTP(widget.email, _otpCtrl.text);

      final token = response['token'];
      final user = User.fromJson(response['user'] ?? {});
      AuthManager().setSession(token, user);

      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.home,
        (route) => false,
      );
    } catch (e) {
      print('DEBUG: OTP verification failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Verification Error: ${e.toString().replaceAll('Exception: ', '')}',
          ),
        ),
      );
    } finally {
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Verify OTP")),
      body: SingleChildScrollView(
        // FIX: Prevents overflow when keyboard is open
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              "A verification code has been sent to ${widget.email}. Please enter it below.",
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 30),
            TextField(
              controller: _otpCtrl,
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              maxLength: 6,
              decoration: const InputDecoration(
                labelText: "Enter 6-digit OTP",
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: isLoading ? null : _verifyOTP,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFC62828),
                padding: const EdgeInsets.symmetric(vertical: 15),
              ),
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text(
                      "Verify Account",
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

// --- DASHBOARD (Bottom Nav Container) ---
class MainNavScreen extends StatefulWidget {
  const MainNavScreen({super.key});
  @override
  State<MainNavScreen> createState() => _MainNavScreenState();
}

class _MainNavScreenState extends State<MainNavScreen> {
  int _currentIndex = 0;
  final List<Widget> _screens = const [
    HomeScreen(),
    CheckInScreen(),
    FindGymScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFFC62828),
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: "Home",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.qr_code_scanner),
            label: "Check In",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center_outlined),
            label: "Find Gym",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: "Profile",
          ),
        ],
      ),
    );
  }
}

// --- HOME TAB (Error Handling & Layout Fixes) ---
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Widget _buildPlanCard(
    BuildContext context,
    SubscriptionPlan plan,
    Color color,
  ) {
    final String shortInterval = plan.interval.length >= 2
        ? plan.interval.substring(0, 2)
        : plan.interval;

    final String contentText =
        '${plan.description}\n\n${plan.features.join(", ")}';

    return GestureDetector(
      onTap: () => Navigator.pushNamed(context, AppRoutes.subscription),
      child: Container(
        width: 150,
        height: 190,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color, width: 1.5),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              plan.name,
              style: TextStyle(
                color: color,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),

            const SizedBox(height: 6),

            Expanded(
              child: SingleChildScrollView(
                child: Text(
                  contentText.trim().isEmpty
                      ? "Access gyms across the city"
                      : contentText,
                  style: const TextStyle(fontSize: 11),
                ),
              ),
            ),

            const SizedBox(height: 8),

            Text(
              'Rs. ${plan.price} / ${plan.interval}',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w900,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlansSection() {
    return FutureBuilder<List<SubscriptionPlan>>(
      future: const ApiService().getPlans(),
      builder: (context, snapshot) {
        // ---------------- LOADING ----------------
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: SizedBox(
              height: 190,
              child: Center(child: CircularProgressIndicator(strokeWidth: 2)),
            ),
          );
        }

        // ---------------- ERROR ----------------
        if (snapshot.hasError) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(20.0),
              child: Text(
                "Error loading plans.",
                style: TextStyle(color: Colors.red),
              ),
            ),
          );
        }

        // ---------------- EMPTY ----------------
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Text("No plans available.");
        }

        final plans = snapshot.data!;

        // Show ONLY monthly plans
        final List<SubscriptionPlan> displayPlans = plans
            .where((p) => p.interval.toLowerCase().startsWith('month'))
            .toList();

        if (displayPlans.isEmpty) {
          return const Text("No monthly plans available.");
        }

        // ---------------- UI (Horizontal scroll) ----------------
        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: List.generate(displayPlans.length, (index) {
              final plan = displayPlans[index];

              return Padding(
                padding: EdgeInsets.only(
                  right: index < displayPlans.length - 1 ? 10 : 0,
                ),
                child: _buildPlanCard(
                  context,
                  plan,
                  _getTierColor(plan.accessTier),
                ),
              );
            }),
          ),
        );
      },
    );
  }

  Widget _buildGymsNearYouList() {
    return FutureBuilder<List<Gym>>(
      future: const ApiService().getGyms(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 30.0),
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (snapshot.hasError) {
          String errorMessage = snapshot.error
              .toString()
              .replaceAll('Exception: ', '')
              .replaceAll('FormatException: ', '');
          if (errorMessage.contains("AUTH_TOKEN_MISSING")) {
            errorMessage =
                "Authentication required. Please log in again to find gyms.";
          }
          print('DEBUG: Gyms loading error: ${snapshot.error}');
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Text(
                "Failed loading gyms: $errorMessage",
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          );
        }

        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 30.0),
              child: Text(
                "No gyms found nearby.",
                style: TextStyle(color: Colors.grey),
              ),
            ),
          );
        }

        final List<Gym> gyms = snapshot.data!;

        return ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: gyms.length.clamp(
            0,
            3,
          ), // Limit the display to 3 for the home screen
          itemBuilder: (context, index) {
            final gym = gyms[index];
            return GymCard(gym: gym);
          },
        );
      },
    );
  }

  @override
  @override
  Widget build(BuildContext context) {
    // Rebuild UI when auth/subscription state changes
    return ValueListenableBuilder<bool>(
      valueListenable: AuthManager().authStatusNotifier,
      builder: (context, isAuthReady, child) {
        final User? dynamicUser = AuthManager().user;
        final bool hasActivePlan = dynamicUser?.membershipTier != null;

        return Scaffold(
          appBar: AppBar(
            automaticallyImplyLeading: false,
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "WELCOME BACK!",
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
                Text(
                  dynamicUser?.name ?? "Guest",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            actions: const [
              Padding(
                padding: EdgeInsets.only(right: 16),
                child: Icon(Icons.notifications_outlined),
              ),
            ],
          ),

          body: RefreshIndicator(
            onRefresh: () async {
              await AuthManager().fetchLocation();
              AuthManager().authStatusNotifier.value =
                  !AuthManager().authStatusNotifier.value;
            },

            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ---------------- HERO BANNER ----------------
                  Container(
                    height: 150,
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.black,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "WELCOME TO THE GYM\nKEY",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 12),

                        ElevatedButton(
                          onPressed: hasActivePlan
                              ? null
                              : () {
                                  Navigator.pushNamed(
                                    context,
                                    AppRoutes.subscription,
                                  );
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: Colors.black,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 5,
                            ),
                            minimumSize: const Size(100, 30),
                          ),
                          child: Text(
                            hasActivePlan
                                ? "Active Subscription"
                                : "See All Plans",
                            style: const TextStyle(fontSize: 12),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ---------------- MEMBERSHIP STATUS ----------------
                  const Text(
                    "Membership Status",
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),

                  Container(
                    margin: const EdgeInsets.only(top: 8),
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: hasActivePlan
                          ? Colors.green.withOpacity(0.1)
                          : Colors.orange.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: hasActivePlan ? Colors.green : Colors.orange,
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          hasActivePlan
                              ? Icons.check_circle
                              : Icons.warning_amber,
                          color: hasActivePlan ? Colors.green : Colors.orange,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            hasActivePlan
                                ? "Active Plan: ${dynamicUser!.membershipTier}"
                                : "No Active Plan - Tap to Upgrade",
                            style: TextStyle(
                              color: hasActivePlan
                                  ? Colors.green
                                  : Colors.orange,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // ---------------- POPULAR PLANS (HIDDEN IF ACTIVE) ----------------
                  if (!hasActivePlan) ...[
                    const Text(
                      "Popular Plans",
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    _buildPlansSection(),
                  ] else ...[
                    // Container(
                    //   margin: const EdgeInsets.only(top: 10),
                    //   padding: const EdgeInsets.all(12),
                    //   decoration: BoxDecoration(
                    //     color: Colors.green.withOpacity(0.1),
                    //     borderRadius: BorderRadius.circular(8),
                    //     border: Border.all(color: Colors.green),
                    //   ),
                    //   // child: const Text(
                    //   //   "You already have an active subscription 🎉",
                    //   //   style: TextStyle(
                    //   //     color: Colors.green,
                    //   //     fontWeight: FontWeight.bold,
                    //   //   ),
                    //   // ),
                    // ),
                  ],

                  const SizedBox(height: 20),

                  // ---------------- GYMS NEAR YOU ----------------
                  const Text(
                    "GYMS NEAR YOU",
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  _buildGymsNearYouList(),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// Reusable Simple Gym Card (Responsive layout)
class GymCard extends StatelessWidget {
  final Gym gym;
  const GymCard({required this.gym, super.key});

  Color _getPlanColor(String planType) {
    return planType.toLowerCase() == 'pro'
        ? const Color(0xFFC62828)
        : Colors.blue;
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, AppRoutes.gymDetails, arguments: gym);
      },
      child: Card(
        margin: const EdgeInsets.only(bottom: 16),
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(12),
                  ),
                  child: Image.network(
                    gym.imageUrl,
                    height: 150,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 150,
                      color: Colors.grey[200],
                      child: const Center(
                        child: Icon(Icons.image, color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getPlanColor(gym.planType),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      gym.planType,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    gym.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on,
                        size: 16,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        // FIX: Ensures long address text is contained
                        child: Text(
                          gym.address,
                          style: const TextStyle(color: Colors.grey),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${gym.distance.toStringAsFixed(1)} km',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFFC62828),
                        ),
                      ),
                    ],
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

// --- CheckInScreen.dart ---

// ---------------- CHECK IN SCREEN (Remains largely the same) ----------------
class CheckInScreen extends StatefulWidget {
  const CheckInScreen({super.key});

  @override
  State<CheckInScreen> createState() => _CheckInScreenState();
}

class _CheckInScreenState extends State<CheckInScreen> {
  final ApiService _api = const ApiService();
  late Future<List<Gym>> _futureGyms;

  @override
  void initState() {
    super.initState();
    _futureGyms = _api.getGyms();
  }

  Future<void> _refreshGyms() async {
    await AuthManager().fetchLocation();
    setState(() {
      _futureGyms = _api.getGyms();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "CHECK-IN",
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        automaticallyImplyLeading: false,
      ),
      body: RefreshIndicator(
        onRefresh: _refreshGyms,
        child: FutureBuilder<List<Gym>>(
          future: _futureGyms,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            }
            if (snapshot.hasError) {
              String errorMessage = snapshot.error
                  .toString()
                  .replaceAll('Exception: ', '')
                  .replaceAll('FormatException: ', '');
              if (errorMessage.contains("AUTH_TOKEN_MISSING")) {
                errorMessage =
                    "Authentication required. Please log in again to check in.";
              }
              print('DEBUG: CheckIn Gyms loading error: ${snapshot.error}');
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Text(
                    "Error loading gyms: $errorMessage",
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.red,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              );
            }
            if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return const Center(
                child: Text(
                  "No gyms found. Check your location settings or try refreshing.",
                  style: TextStyle(color: Colors.grey),
                ),
              );
            }

            final List<Gym> gyms = snapshot.data!;

            return ListView.separated(
              padding: const EdgeInsets.only(top: 8.0),
              itemCount: gyms.length,
              separatorBuilder: (context, index) =>
                  const Divider(height: 1, indent: 24, endIndent: 24),
              itemBuilder: (context, index) {
                final gym = gyms[index];
                return CheckInGymCard(gym: gym);
              },
            );
          },
        ),
      ),
    );
  }
}

// ---------------- CHECK IN GYM CARD (Modified Handler) ----------------
class CheckInGymCard extends StatelessWidget {
  final Gym gym;
  const CheckInGymCard({required this.gym, super.key});

  Future<void> _handleCheckIn(BuildContext context, Gym selectedGym) async {
    print('DEBUG: Check In attempted for ${selectedGym.name}');

    // 🔑 FIX: Navigate to the QR scanner screen and wait for a result
    final scanResult = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => QRScannerScreen(gym: selectedGym),
      ),
    );

    // Handle the result returned from the scanner screen (if any)
    if (scanResult != null && scanResult is bool && scanResult == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Successfully checked into ${selectedGym.name}!"),
          backgroundColor: Colors.green,
        ),
      );
    } else if (scanResult is String) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(scanResult), backgroundColor: Colors.red),
      );
    } else {
      // User likely cancelled or no successful check-in occurred
    }
  }

  Color _getPlanColor(String planType) {
    return planType.toLowerCase() == 'pro'
        ? const Color(0xFFC62828)
        : Colors.blueGrey;
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        Navigator.pushNamed(context, AppRoutes.gymDetails, arguments: gym);
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ... (Image and Details sections remain the same)
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.network(
                    gym.imageUrl,
                    height: 80,
                    width: 80,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 80,
                      width: 80,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Center(
                        child: Icon(Icons.image, color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  top: 0,
                  left: 0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: _getPlanColor(gym.planType),
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(8),
                        bottomRight: Radius.circular(8),
                      ),
                    ),
                    child: Text(
                      gym.planType,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 15),

            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    gym.name,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      const Icon(
                        Icons.location_on_outlined,
                        size: 16,
                        color: Colors.grey,
                      ),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          gym.address,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Colors.black54,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      // Text(
                      //   '${gym.distance.toStringAsFixed(2)} KMS',
                      //   style: const TextStyle(
                      //     fontSize: 14,
                      //     fontWeight: FontWeight.w600,
                      //     color: Colors.black,
                      //   ),
                      // ),
                      // const SizedBox(width: 15),
                      // const Icon(
                      //   Icons.directions,
                      //   size: 16,
                      //   color: Colors.black54,
                      // ),
                      // const SizedBox(width: 4),
                      // const Text(
                      //   'GET DIRECTION',
                      //   style: TextStyle(fontSize: 12, color: Colors.black54),
                      // ),
                    ],
                  ),
                ],
              ),
            ),

            // 3. Check In Button (Fixed size)
            Align(
              alignment: Alignment.center,
              child: SizedBox(
                height: 40,
                child: ElevatedButton(
                  // 🔑 FIX: Pass the entire gym object to the handler
                  onPressed: () => _handleCheckIn(context, gym),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1B5E20), // Dark green
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    minimumSize: const Size(90, 40),
                    elevation: 0,
                  ),
                  child: const Text(
                    "CHECK IN",
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
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

class QRScannerScreen extends StatefulWidget {
  final Gym gym;
  const QRScannerScreen({super.key, required this.gym});

  @override
  State<QRScannerScreen> createState() => _QRScannerScreenState();
}

class _QRScannerScreenState extends State<QRScannerScreen> {
  final MobileScannerController _scannerController = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    facing: CameraFacing.back,
  );
  // Assuming ApiService is available globally or imported
  final ApiService _api = const ApiService();
  bool _isProcessing = false;

  @override
  void dispose() {
    // Always dispose of controllers
    _scannerController.dispose();
    super.dispose();
  }

  // ---------------- FINAL MODIFIED QR CODE HANDLER ----------------
  void _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;

    final String? rawValue = capture.barcodes.first.rawValue;

    // 1. Validate for null and emptiness
    if (rawValue == null || rawValue.trim().isEmpty) {
      print('DEBUG: Scanner value was null or empty. Continuing scan.');
      return;
    }

    // Value is valid, proceed.

    // Stop the scanner to prevent multiple scans
    await _scannerController.stop();

    setState(() {
      _isProcessing = true;
    });

    // Attempt Check-in API Call
    try {
      final bool success = await _api.checkInGym(
        gymId: widget.gym.id,
        qrToken: rawValue.trim(), // Use the trimmed value
      );

      // Return success result to the previous screen
      if (mounted) {
        Navigator.pop(context, success);
      }
    } catch (e) {
      print('DEBUG: Check-in API failed: $e');

      // Extract error message for the SnackBar feedback
      String errorMessage = e.toString().replaceAll('Exception: ', '');

      if (mounted) {
        // Show error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Check-in failed: $errorMessage'),
            duration: const Duration(seconds: 4),
            backgroundColor: Colors.red,
          ),
        );

        // --- 🔑 FIX: DEFENSIVE RESTART SEQUENCE with DELAY ---
        try {
          await _scannerController.stop();

          // Add a short delay to allow the underlying camera resources to be fully released.
          await Future.delayed(const Duration(milliseconds: 50));

          await _scannerController.start();
        } catch (restartError) {
          print('DEBUG: Failed to restart scanner gracefully: $restartError');
        }

        setState(() {
          _isProcessing = false;
        });
      }
    }
  }

  // ---------------- BUILD METHOD ----------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Check-in at ${widget.gym.name}"),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          // 1. Mobile Scanner View (Camera Feed)
          MobileScanner(
            controller: _scannerController,
            onDetect: _onDetect,
            errorBuilder: (context, error, child) {
              print('CAMERA ERROR: $error');
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Text(
                    'Camera Error: ${error.toString().replaceAll('MobileScannerException: ', '')}\n\nCheck native permissions.',
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              );
            },
          ),

          // 2. Custom Overlay UI (Semi-transparent background + scanning box)
          Container(
            color: Colors.black54,
            child: CustomPaint(
              painter: BarcodeOutlinePainter(
                boxSize: const Size(200, 200),
                borderColor: Colors.white,
                borderRadius: 10.0,
              ),
              child: Center(
                child: Container(
                  width: 200,
                  height: 200,
                  alignment: Alignment.bottomCenter,
                  padding: const EdgeInsets.only(bottom: 15),
                  child: const Text(
                    "Center the QR code",
                    style: TextStyle(color: Colors.white70, fontSize: 14),
                  ),
                ),
              ),
            ),
          ),

          // 3. Processing Overlay
          if (_isProcessing)
            Container(
              color: Colors.black.withOpacity(0.7),
              child: const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // SpinKitFadingCube (Ensure you have flutter_spinkit imported)
                    // SpinKitFadingCube(color: Colors.white, size: 50.0),
                    SizedBox(
                      width: 50,
                      height: 50,
                      child: CircularProgressIndicator(color: Colors.white),
                    ),
                    SizedBox(height: 20),
                    Text(
                      "Checking in...",
                      style: TextStyle(color: Colors.white, fontSize: 16),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// ---------------- BarcodeOutlinePainter Class (required for the UI) ----------------
class BarcodeOutlinePainter extends CustomPainter {
  final Size boxSize;
  final Color borderColor;
  final double borderRadius;

  BarcodeOutlinePainter({
    required this.boxSize,
    required this.borderColor,
    required this.borderRadius,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final Rect rect = Offset.zero & size;
    final double width = boxSize.width;
    final double height = boxSize.height;

    // Center the square
    final Rect cutoutRect = Rect.fromLTWH(
      (size.width - width) / 2,
      (size.height - height) / 2,
      width,
      height,
    );

    // 1. Draw the border around the cut-out
    final borderPaint = Paint()
      ..color = borderColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.0;

    canvas.drawRRect(
      RRect.fromRectAndRadius(cutoutRect, Radius.circular(borderRadius)),
      borderPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// --- FIND GYM TAB (Uses live address display) ---
class FindGymScreen extends StatefulWidget {
  const FindGymScreen({super.key});

  @override
  State<FindGymScreen> createState() => _FindGymScreenState();
}

class _FindGymScreenState extends State<FindGymScreen> {
  bool isMapView = false; // Default to List View for better initial experience
  late Future<List<Gym>> _futureGyms;

  @override
  void initState() {
    super.initState();
    _futureGyms = const ApiService().getGyms();
  }

  void _toggleView(bool toMapView) {
    setState(() {
      isMapView = toMapView;
    });
  }

  Future<void> _refreshLocationAndGyms() async {
    await AuthManager().fetchLocation();
    setState(() {
      _futureGyms = const ApiService().getGyms();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Find Gym")),
      body: RefreshIndicator(
        onRefresh: _refreshLocationAndGyms,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Location Bar (Uses ValueListenableBuilder for real-time address updates)
                  ValueListenableBuilder<bool>(
                    valueListenable: AuthManager().locationStatusNotifier,
                    builder: (context, isLoading, child) {
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(
                            Icons.person_pin_circle,
                            size: 30,
                            color: Colors.black87,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  "YOUR LOCATION",
                                  style: TextStyle(
                                    fontSize: 10,
                                    color: Colors.grey,
                                  ),
                                ),
                                Text(
                                  AuthManager()
                                      .currentAddress, // Now displays address
                                  style: const TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                if (AuthManager().currentLocation == null)
                                  TextButton(
                                    onPressed: _refreshLocationAndGyms,
                                    child: const Text('Tap to retry location'),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                  const SizedBox(height: 15),
                  // Map/List Toggle Buttons (Responsive layout)
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => _toggleView(true),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: isMapView
                                ? const Color(0xFF1B5E20)
                                : Colors.white,
                            side: const BorderSide(color: Color(0xFF1B5E20)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            "Map view",
                            style: TextStyle(
                              color: isMapView ? Colors.white : Colors.black87,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => _toggleView(false),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: !isMapView
                                ? const Color(0xFF1B5E20)
                                : Colors.white,
                            side: const BorderSide(color: Color(0xFF1B5E20)),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: Text(
                            "List view",
                            style: TextStyle(
                              color: !isMapView ? Colors.white : Colors.black87,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            Expanded(
              child: FutureBuilder<List<Gym>>(
                future: _futureGyms,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (snapshot.hasError ||
                      !snapshot.hasData ||
                      snapshot.data!.isEmpty) {
                    return const Center(child: Text("No gyms available."));
                  }

                  final gyms = snapshot.data!;

                  return isMapView
                      ? GymMapView(
                          gyms: gyms,
                        ) // <-- replaces MapViewPlaceholder
                      : GymListView(futureGyms: _futureGyms);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class GymMapView extends StatefulWidget {
  final List<Gym> gyms;
  const GymMapView({super.key, required this.gyms});

  @override
  State<GymMapView> createState() => _GymMapViewState();
}

class _GymMapViewState extends State<GymMapView> {
  late final fm.MapController _mapController;
  latlng.LatLng _userLocation = latlng.LatLng(
    33.741,
    72.785,
  ); // fallback location

  @override
  void initState() {
    super.initState();
    _mapController = fm.MapController();
    _initLocation();
  }

  Future<void> _initLocation() async {
    await AuthManager().fetchLocation();
    final loc = AuthManager().currentLocation;
    if (loc != null) {
      setState(() {
        _userLocation = latlng.LatLng(loc.latitude, loc.longitude);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return fm.FlutterMap(
      mapController: _mapController,
      options: fm.MapOptions(
        initialCenter: _userLocation,
        initialZoom: 13,
        maxZoom: 18,
        minZoom: 5,
      ),
      children: [
        // Tile layer
        fm.TileLayer(
          urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          subdomains: const ['a', 'b', 'c'],
          userAgentPackageName: 'com.example.app',
        ),
        // Marker layer
        fm.MarkerLayer(
          markers: [
            // User location
            fm.Marker(
              point: _userLocation,
              width: 50,
              height: 50,
              child: const Icon(
                Icons.my_location,
                color: Colors.blue,
                size: 30,
              ),
            ),
            // Gym markers
            ...widget.gyms.map(
              (gym) => fm.Marker(
                point: latlng.LatLng(gym.latitude, gym.longitude),
                width: 80,
                height: 80,
                child: GestureDetector(
                  onTap: () {
                    showModalBottomSheet(
                      context: context,
                      builder: (_) => Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              gym.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 5),
                            Text(gym.address),
                          ],
                        ),
                      ),
                    );
                  },
                  child: const Icon(
                    Icons.location_on,
                    color: Colors.red,
                    size: 40,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// class MapViewPlaceholder extends StatelessWidget {
//   const MapViewPlaceholder({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       color: Colors.grey[800],
//       width: double.infinity,
//       child: Center(
//         child: Padding(
//           padding: const EdgeInsets.all(20.0),
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               const Icon(Icons.map, size: 80, color: Colors.white70),
//               const SizedBox(height: 10),
//               const Text(
//                 "Map View Placeholder",
//                 style: TextStyle(color: Colors.white70, fontSize: 18),
//               ),
//               const SizedBox(height: 5),
//               Text(
//                 "Current Location: ${AuthManager().currentAddress}",
//                 textAlign: TextAlign.center,
//                 style: const TextStyle(color: Colors.white54, fontSize: 12),
//               ),
//             ],
//           ),
//         ),
//       ),
//     );
//   }
// }

class GymListView extends StatelessWidget {
  final Future<List<Gym>> futureGyms;
  const GymListView({required this.futureGyms, super.key});

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Gym>>(
      future: futureGyms,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          String errorMessage = snapshot.error
              .toString()
              .replaceAll('Exception: ', '')
              .replaceAll('FormatException: ', '');
          if (errorMessage.contains("AUTH_TOKEN_MISSING")) {
            errorMessage =
                "Authentication required. Please log in again to find gyms.";
          }
          print('DEBUG: GymListView error: ${snapshot.error}');
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Text(
                "Error loading gyms: $errorMessage",
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.red,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          );
        }
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const Center(child: Text("No gyms available."));
        }

        final List<Gym> gyms = snapshot.data!;

        return ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: gyms.length,
          itemBuilder: (context, index) {
            return GymCard(gym: gyms[index]);
          },
        );
      },
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Color _tierColor(String? tier) {
    switch (tier?.toLowerCase()) {
      case '1':
      case 'standard':
        return Colors.blue;
      case '2':
      case 'pro':
        return const Color(0xFFC62828);
      case '3':
      case 'elite':
        return Colors.amber.shade700;
      default:
        return Colors.grey;
    }
  }

  String _tierLabel(String? tier) {
    if (tier == null) return "No Active Plan";
    return "Tier $tier";
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthManager().user;
    final bool hasActivePlan = user?.membershipTier != null;

    return Scaffold(
      appBar: AppBar(title: const Text("My Profile"), centerTitle: true),

      body: RefreshIndicator(
        onRefresh: () async {
          // Refresh user from backend (token-based)
          AuthManager().authStatusNotifier.value =
              !AuthManager().authStatusNotifier.value;
        },

        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ---------------- USER HEADER ----------------
              Center(
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: const Color(0xFFC62828),
                      child: Text(
                        user?.name.isNotEmpty == true
                            ? user!.name[0].toUpperCase()
                            : "U",
                        style: const TextStyle(
                          fontSize: 36,
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      user?.name ?? "Guest User",
                      style: const TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      user?.email ?? "email@example.com",
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // ---------------- MEMBERSHIP CARD ----------------
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: hasActivePlan
                      ? _tierColor(user!.membershipTier).withOpacity(0.1)
                      : Colors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: hasActivePlan
                        ? _tierColor(user!.membershipTier)
                        : Colors.orange,
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      hasActivePlan
                          ? Icons.verified
                          : Icons.warning_amber_rounded,
                      color: hasActivePlan
                          ? _tierColor(user!.membershipTier)
                          : Colors.orange,
                      size: 30,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            hasActivePlan
                                ? "Active Subscription"
                                : "No Active Subscription",
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            hasActivePlan
                                ? _tierLabel(user!.membershipTier)
                                : "Upgrade to access gyms",
                            style: const TextStyle(color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                    if (!hasActivePlan)
                      TextButton(
                        onPressed: () => Navigator.pushNamed(
                          context,
                          AppRoutes.subscription,
                        ),
                        child: const Text("Upgrade"),
                      ),
                  ],
                ),
              ),

              const SizedBox(height: 30),

              // ---------------- ACCOUNT INFO ----------------
              const Text(
                "Account Information",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),

              _infoTile(Icons.phone, "Phone", user?.phone ?? "Not provided"),
              _infoTile(Icons.email, "Email", user?.email ?? "Not available"),
              _infoTile(
                Icons.calendar_today,
                "Member Since",
                user?.formattedCreatedAt ?? "N/A",
              ),

              const SizedBox(height: 30),

              // ---------------- ACTIVITY (REALISTIC UX) ----------------
              const Text(
                "Activity",
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),

              ListTile(
                leading: const Icon(Icons.history),
                title: const Text("Check-in History"),
                subtitle: const Text("View your recent gym visits"),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Check-in history coming soon"),
                    ),
                  );
                },
              ),

              const Divider(),

              // ---------------- ACTIONS ----------------
              ListTile(
                leading: const Icon(Icons.subscriptions),
                title: const Text("Manage Subscription"),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () =>
                    Navigator.pushNamed(context, AppRoutes.subscription),
              ),

              ListTile(
                leading: const Icon(Icons.refresh),
                title: const Text("Refresh Profile"),
                onTap: () {
                  AuthManager().authStatusNotifier.value =
                      !AuthManager().authStatusNotifier.value;
                },
              ),

              const Divider(),

              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text(
                  "Logout",
                  style: TextStyle(color: Colors.red),
                ),
                onTap: () {
                  AuthManager().logout();
                  Navigator.pushNamedAndRemoveUntil(
                    context,
                    AppRoutes.auth,
                    (route) => false,
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _infoTile(IconData icon, String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 20, color: const Color(0xFFC62828)),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 13, color: Colors.grey),
              ),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class SubscriptionScreen extends StatelessWidget {
  const SubscriptionScreen({super.key});

  // ---------------- Tier Color Mapping ----------------
  Color _getTierColor(int tier) {
    switch (tier) {
      case 1:
        return Colors.blue.shade600;
      case 2:
        return const Color(0xFFC62828);
      case 3:
        return Colors.amber.shade700;
      default:
        return Colors.grey;
    }
  }

  // ---------------- Feature Row Widget ----------------
  Widget _buildFeatureRow(IconData icon, String text, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: const TextStyle(fontSize: 14))),
        ],
      ),
    );
  }

  void _handlePaymentInitiation(
    BuildContext context,
    SubscriptionPlan plan,
  ) async {
    const storage = FlutterSecureStorage();

    print("========== PAYMENT DEBUG START ==========");

    // 1️⃣ Read JWT token
    final token = await storage.read(key: "jwt_token");

    print("JWT Token exists: ${token != null}");
    if (token != null) {
      print("JWT Token (first 20 chars): ${token.substring(0, 20)}...");
    }

    if (token == null) {
      print("❌ ERROR: User not logged in (token null)");
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text("User not logged in")));
      return;
    }

    // 2️⃣ Prepare request
    final url = Uri.parse(
      "https://gymkey-backend-production.up.railway.app/api/subscription/create-session",
    );

    final headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer $token",
    };

    final body = convert.jsonEncode({"priceId": plan.id});

    print("➡️ REQUEST URL: $url");
    print("➡️ REQUEST HEADERS: $headers");
    print("➡️ REQUEST BODY: $body");

    try {
      // 3️⃣ Send request
      print("⏳ Sending payment request...");
      final response = await http.post(url, headers: headers, body: body);

      print("✅ RESPONSE RECEIVED");
      print("⬅️ STATUS CODE: ${response.statusCode}");
      print("⬅️ RAW RESPONSE BODY: ${response.body}");

      // 4️⃣ Parse response safely
      Map<String, dynamic> data;
      try {
        data = convert.jsonDecode(response.body);
        print("⬅️ PARSED RESPONSE JSON: $data");
      } catch (e) {
        print("❌ JSON PARSE ERROR: $e");
        throw "Invalid JSON from server";
      }

      // 5️⃣ Handle response
      if (response.statusCode == 200 && data["url"] != null) {
        print("✅ Checkout URL found: ${data['url']}");
        print("➡️ Navigating to CheckoutWebView");

        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => CheckoutWebView(url: data["url"])),
        );
      } else {
        print("❌ Payment failed");
        print("❌ STATUS: ${response.statusCode}");
        print("❌ MESSAGE: ${data['message'] ?? 'No message'}");
        throw "Checkout URL missing or invalid response";
      }
    } catch (e, stack) {
      print("🔥 PAYMENT EXCEPTION");
      print("🔥 ERROR: $e");
      print("🔥 STACK TRACE:\n$stack");

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text("Payment Error: $e")));
    } finally {
      print("========== PAYMENT DEBUG END ==========");
    }
  }

  // --------------------------- UI BUILD ---------------------------
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Choose Your Plan")),
      body: FutureBuilder<List<SubscriptionPlan>>(
        future: ApiService().getPlans(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError || !snapshot.hasData) {
            return Center(
              child: Text(
                "Error loading plans.\n${snapshot.error}",
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.red),
              ),
            );
          }

          final plans = snapshot.data!;
          if (plans.isEmpty) {
            return const Center(
              child: Text("No subscription plans available."),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: plans.length,
            itemBuilder: (context, index) {
              final plan = plans[index];
              final planColor = _getTierColor(plan.accessTier);

              return Card(
                elevation: 5,
                margin: const EdgeInsets.only(bottom: 20),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(15),
                  side: BorderSide(color: planColor, width: 2),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      Text(
                        plan.name,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          color: planColor,
                        ),
                      ),

                      const Divider(height: 25),

                      // Price + Interval
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            "Rs. ${plan.price}",
                            style: TextStyle(
                              fontSize: 30,
                              fontWeight: FontWeight.bold,
                              color: planColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            "/ ${plan.interval}",
                            style: const TextStyle(
                              fontSize: 18,
                              color: Colors.black54,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 15),

                      // Description
                      Text(
                        plan.description.isNotEmpty
                            ? plan.description
                            : "No description provided.",
                        style: const TextStyle(fontSize: 14.5),
                      ),

                      const SizedBox(height: 15),

                      // Features
                      ...plan.features.map(
                        (feature) => _buildFeatureRow(
                          Icons.check_circle_rounded,
                          feature,
                          planColor,
                        ),
                      ),

                      const SizedBox(height: 25),

                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: () =>
                              _handlePaymentInitiation(context, plan),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: planColor,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: Text(
                            "Subscribe (Rs. ${plan.price})",
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

class CheckoutWebView extends StatefulWidget {
  final String url;

  const CheckoutWebView({super.key, required this.url});

  @override
  State<CheckoutWebView> createState() => _CheckoutWebViewState();
}

class _CheckoutWebViewState extends State<CheckoutWebView> {
  bool _loading = true;
  late WebViewController _controller;

  static const successBaseUrl =
      "https://gymkey-backend-production.up.railway.app/subscription/success";

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (url) {
            setState(() => _loading = false);

            // Detect STRIPE SUCCESS redirect
            if (url.startsWith(successBaseUrl)) {
              _handleSuccess();
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  Future<void> _handleSuccess() async {
    Navigator.pop(context); // close WebView first

    // Now verify subscription from server
    await Future.delayed(const Duration(milliseconds: 300));

    _checkSubscriptionStatus();
  }

  Future<void> _checkSubscriptionStatus() async {
    const storage = FlutterSecureStorage();
    final token = await storage.read(key: "jwt_token");

    if (token == null) return;

    try {
      final response = await http.get(
        Uri.parse(
          "https://gymkey-backend-production.up.railway.app/subscription/status",
        ),
        headers: {"Authorization": "Bearer $token"},
      );

      final data = convert.jsonDecode(response.body);

      if (data["hasActiveSubscription"] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Subscription Activated ✔ (${data['plan']})")),
        );

        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Payment done, but no plan found!")),
        );
      }
    } catch (e) {
      print("Subscription check error: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Processing Payment")),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_loading) const Center(child: CircularProgressIndicator()),
        ],
      ),
    );
  }
}

// --- GYM DETAIL SCREEN (FIXED: Overflow) ---
class GymDetailScreen extends StatelessWidget {
  final Gym gym;
  const GymDetailScreen({required this.gym, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Header
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(20),
                  ),
                  child: Image.network(
                    gym.imageUrl,
                    height: 300,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      height: 300,
                      color: Colors.grey[200],
                      child: const Center(
                        child: Icon(Icons.image, size: 50, color: Colors.grey),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 0,
                  left: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withOpacity(0.7),
                        ],
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          gym.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 16,
                              color: Colors.white70,
                            ),
                            const SizedBox(width: 5),
                            Expanded(
                              child: Text(
                                gym.address,
                                style: const TextStyle(color: Colors.white70),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Distance & Plan Type (FIXED: Row items are Expanded)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Fix: Wrap the InfoBox in Expanded to prevent horizontal overflow
                      Expanded(
                        child: _buildInfoBox(
                          '${gym.distance.toStringAsFixed(1)} km',
                          'Distance',
                          Icons.near_me,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        // Fix: Wrap the InfoBox in Expanded to prevent horizontal overflow
                        child: _buildInfoBox(
                          gym.planType,
                          'Plan Tier',
                          Icons.star,
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 30),

                  // Facilities
                  const Text(
                    "Facilities",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: gym.facilities
                        .map(
                          (facility) => Chip(
                            label: Text(facility),
                            backgroundColor: Colors.grey[200],
                          ),
                        )
                        .toList(),
                  ),
                  const Divider(height: 30),

                  // Operating Hours
                  const Text(
                    "Operating Hours",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  ...gym.hours.entries
                      .map(
                        (e) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                e.key,
                                style: const TextStyle(
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              Text(e.value),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ],
              ),
            ),

            // Check-in Button
            Container(
              padding: const EdgeInsets.all(16),
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  print('DEBUG: Navigating to Check-In for ${gym.name}');
                  // Simulate navigation to the Check-In tab
                  Navigator.popUntil(
                    context,
                    ModalRoute.withName(AppRoutes.home),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFC62828),
                  padding: const EdgeInsets.symmetric(vertical: 15),
                ),
                child: const Text(
                  "Check In at This Gym",
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoBox(String value, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: const Color(0xFFC62828)),
          const SizedBox(height: 5),
          Text(
            value,
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            maxLines: 1,
            overflow: TextOverflow
                .ellipsis, // Ensures the text doesn't overflow horizontally
          ),
          Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ],
      ),
    );
  }
}
