import 'package:campus_mobile_experimental/core/data_providers/parking_data_provider.dart';
import 'package:campus_mobile_experimental/core/models/parking_model.dart';
import 'package:flutter/material.dart';
import 'package:campus_mobile_experimental/ui/widgets/container_view.dart';
import 'package:provider/provider.dart';

class ManageParkingView extends StatelessWidget {
  ParkingDataProvider parkingDataProvider;
  @override
  Widget build(BuildContext context) {
    parkingDataProvider = Provider.of<ParkingDataProvider>(context);
    return ContainerView(
      child: buildLocationsList(context),
    );
  }

  Widget buildLocationsList(BuildContext context) {
    return ReorderableListView(
      children: createList(context),
      onReorder: _onReorder,
    );
  }

  void _onReorder(int oldIndex, int newIndex) {
    if (newIndex > oldIndex) {
      newIndex -= 1;
    }
    List<DiningModel> newOrder = parkingDataProvider.parkingModels;
    DiningModel item = newOrder.removeAt(oldIndex);
    newOrder.insert(newIndex, item);
    List<String> orderedLocationNames = List<String>();
    for (DiningModel item in newOrder) {
      orderedLocationNames.add(item.locationName);
    }
    parkingDataProvider.reorderLots(orderedLocationNames);
  }

  List<Widget> createList(BuildContext context) {
    List<Widget> list = List<Widget>();
    for (DiningModel model in parkingDataProvider.parkingModels) {
      list.add(ListTile(
        key: Key(model.locationId.toString()),
        title: Text(model.locationName),
        trailing: Icon(Icons.reorder),
      ));
    }
    return list;
  }
}
