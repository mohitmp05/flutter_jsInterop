import 'dart:async';

import 'package:flutter/material.dart';
import 'package:j_s_interop_example/app_state.dart';

class InactivityHandler extends StatefulWidget {
  final Widget child;
  const InactivityHandler({required this.child});

  @override
  _InactivityHandlerState createState() => _InactivityHandlerState();
}

class _InactivityHandlerState extends State<InactivityHandler> with WidgetsBindingObserver {
  Timer? _timer;
  static const Duration sessionTimeout = Duration(minutes: 1); // 1 min timeout

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _resetTimer();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _timer?.cancel();
    super.dispose();
  }

  // Reset inactivity timer
  void _resetTimer() {
    _timer?.cancel();
    _timer = Timer(sessionTimeout, _handleSessionTimeout);
  }

  // Handle session timeout (Navigate to login)
  void _handleSessionTimeout() {
    print("Session expired due to inactivity!");
   FFAppState().update((){
     FFAppState().isSessionExpired = true;
   });
   print(FFAppState().isSessionExpired);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      behavior: HitTestBehavior.translucent, // Capture taps anywhere
      onTap: _resetTimer, // Reset timer on tap
      onPanDown: (_) => _resetTimer(), // Reset on touch
      child: widget.child, // Wrap app content
    );
  }
}