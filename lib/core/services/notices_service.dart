import 'dart:async';
import 'dart:developer';

import 'package:campus_mobile_experimental/core/models/notices_model.dart';
import 'package:campus_mobile_experimental/core/services/networking.dart';

class NoticesService {
  bool _isLoading = false;
  DateTime _lastUpdated;
  String _error;
  final NetworkHelper _networkHelper = NetworkHelper();
  final Map<String, String> headers = {
    "accept": "application/json",
  };
  final String endpoint =
      "https://tbk5wko7a9.execute-api.us-west-1.amazonaws.com/dev/msm-linksservice/v1";
  List<NoticesModel> _noticesModel = List<NoticesModel>();

  Future<bool> fetchData() async {
    _error = null;
    _isLoading = true;
    try {
      /// fetch data
//      String _response =
//          await _networkHelper.authorizedFetch(endpoint, headers);
//
//      /// parse data
//      _noticesModel = noticesModelFromJson(_response);
      _isLoading = false;
      // todo: remove dummy data and call notices endpoint when available
      _noticesModel = noticesModelFromJson('[{"notice-title": "Coronavirus Information","notice-banner-image": "https://mobile.ucsd.edu/feeds/_resources/media/promo-banners/covid-19-app-20-03-04.png","notice-banner-link": "https://go.ucsd.edu/38nb0Pf"}]');
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      return false;
    }
  }

  bool get isLoading => _isLoading;

  String get error => _error;

  DateTime get lastUpdated => _lastUpdated;

  NetworkHelper get availabilityService => _networkHelper;

  List<NoticesModel> get noticesModel => _noticesModel;
}
