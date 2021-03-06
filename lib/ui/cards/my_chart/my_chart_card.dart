import 'package:campus_mobile_experimental/core/constants/app_constants.dart';
import 'package:campus_mobile_experimental/core/data_providers/user_data_provider.dart';
import 'package:campus_mobile_experimental/core/services/bottom_navigation_bar_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:campus_mobile_experimental/ui/reusable_widgets/card_container.dart';

import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

class MyChartCard extends StatelessWidget {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');

  @override
  Widget build(BuildContext context) {
    return CardContainer(
      active: Provider.of<UserDataProvider>(context).cardStates['my_chart'],
      hide: () => Provider.of<UserDataProvider>(context, listen: false)
          .toggleCard('my_chart'),
      reload: () => null,
      isLoading: false,
      title: buildTitle(),
      errorText: null,
      child: () => buildCardContent(context),
      actionButtons: buildActionButtons(context),
    );
  }

  Widget buildTitle() {
    return Text(
      "MyUCSDChart",
      textAlign: TextAlign.left,
    );
  }

  Widget buildCardContent(BuildContext context) {
    return Row(
      children: <Widget>[
        Container(
          child: Image.asset(
            'assets/images/MyChartLogo.png',
            fit: BoxFit.contain,
            height: 56,
          ),
          padding: EdgeInsets.only(
            left: 10,
            right: 10,
          ),
        ),
        Text(
          'Your secure online health connection.',
          textAlign: TextAlign.left,
        )
      ],
    );
  }

  List<Widget> buildActionButtons(BuildContext context) {
    List<Widget> actionButtons = List<Widget>();
    actionButtons.add(FlatButton(
      child: Text(
        'Sign In Now',
      ),
      onPressed: () {
        handleTap();
      },
    ));
    return actionButtons;
  }

  void handleTap() {
    String myChartUrl = 'https://mystudentchart.ucsd.edu/shs/';
    openLink(myChartUrl);
  }

  openLink(String url) async {
    if (await canLaunch(url)) {
      launch(url);
    }
    else {
      // can't launch url, there is some error
    }
  }
}
