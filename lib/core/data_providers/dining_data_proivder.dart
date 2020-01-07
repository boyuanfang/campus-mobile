import 'package:campus_mobile_experimental/core/models/coordinates_model.dart';
import 'package:campus_mobile_experimental/core/models/dining_menu_items_model.dart';
import 'package:campus_mobile_experimental/core/models/dining_model.dart';
import 'package:campus_mobile_experimental/core/services/dining_service.dart';
import 'package:flutter/material.dart';
import 'dart:math' show cos, sqrt, asin;

class DiningDataProvider extends ChangeNotifier {
  DiningDataProvider() {
    ///DEFAULT STATES
    _isLoading = false;

    ///INITIALIZE SERVICES
    _diningService = DiningService();
  }

  ///STATES
  bool _isLoading;
  DateTime _lastUpdated;
  String _error;

  ///MODELS
  Map<String, DiningModel> _diningModels = Map<String, DiningModel>();
  Map<String, DiningMenuItemsModel> _diningMenuItemModels =
      Map<String, DiningMenuItemsModel>();
  Coordinates _coordinates;

  ///SERVICES
  DiningService _diningService;

  void fetchDiningMenu(String menuId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    if (await _diningService.fetchMenu(menuId)) {
      _diningMenuItemModels[menuId] = _diningService.menuData;
    } else {
      _error = _diningService.error;
    }
    notifyListeners();
  }

  void fetchDiningLocations() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    /// creating  new map ensures we remove all unsupported locations
    Map<String, DiningModel> mapOfDiningLocations = Map<String, DiningModel>();
    if (await _diningService.fetchData()) {
      for (DiningModel model in _diningService.data) {
        mapOfDiningLocations[model.name] = model;
      }

      ///replace old list of locations with new one
      _diningModels = mapOfDiningLocations;

      ///calculate distance of each eatery to user's current location
      populateDistances();
      _lastUpdated = DateTime.now();
    } else {
      ///TODO: determine what error to show to the user
      _error = _diningService.error;
    }
    _isLoading = false;
    notifyListeners();
  }

  List<DiningModel> reorderLocations() {
    if (_coordinates == null) {
      return _diningModels.values.toList();
    }
    List<DiningModel> orderedListOfLots = _diningModels.values.toList();
    orderedListOfLots.sort((DiningModel a, DiningModel b) {
      if (a.distance != null && b.distance != null) {
        return a.distance.compareTo(b.distance);
      }
      return 0;
    });
    return orderedListOfLots;
  }

  void populateDistances() {
    if (_coordinates != null) {
      for (DiningModel model in _diningModels.values.toList()) {
        if (model.coordinates != null) {
          var distance = calculateDistance(_coordinates.lat, _coordinates.lon,
                  model.coordinates.lat, model.coordinates.lon) *
              0.00062137;
          model.distance = distance;
          print(distance);
        }
      }
    }
  }

  num calculateDistance(double lat1, double lon1, double lat2, double lon2) {
    var p = 0.017453292519943295;
    var c = cos;
    var a = 0.5 -
        c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
    return 12742 * asin(sqrt(a));
  }

  ///This setter is only used in provider to supply an updated Coordinates object
  set coordinates(Coordinates value) {
    _coordinates = value;
  }

  ///SIMPLE GETTERS
  bool get isLoading => _isLoading;
  String get error => _error;
  DateTime get lastUpdated => _lastUpdated;

  DiningMenuItemsModel getMenuData(String id) {
    if (_diningMenuItemModels != null && _diningMenuItemModels[id] != null) {
      return _diningMenuItemModels[id];
    }
    return DiningMenuItemsModel();
  }

  ///RETURNS A List<diningModels> sorted by distance
  List<DiningModel> get diningModels {
    if (_diningModels != null) {
      ///check if we have a coordinates object
      if (_coordinates != null) {
        return reorderLocations();
      }
      return _diningModels.values.toList();
    }
    return List<DiningModel>();
  }
}
