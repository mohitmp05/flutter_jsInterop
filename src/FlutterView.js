import React, { useEffect, useRef, memo } from "react";

import { Box, CircularProgress } from "@mui/material";

// The global _flutter namespace
declare var _flutter;

const divStyle = {
  height: "100%",
  width: "100%",
};

const FlutterView = memo(
  ({
    assetBase = "",
    src = "main.dart.js",
    onClicksChange,
    onColorChange,
    onTextChange,
    onSessionExpiredChange,
    text,
    color,
    clicks,
    sessionExpired,
  }) => {
    const flutterState = useRef(null);
    const ref = useRef(null);

    const onFlutterAppLoaded = (state) => {
      flutterState.current = state;
      // listen to state changes

      state.onClicksChanged(onClicksChange);
      state.onTextChanged(onTextChange);
      state.onColorChanged(onColorChange);
      state.onSessionExpiredChanged(onSessionExpiredChange);
      // set initial values
      state.setText(text);
      state.setColor(color);
      state.setClicks(clicks);
      state.setSessionExpired(sessionExpired);
    };

    useEffect(() => {
      const target = ref.current;
      let isRendered = true;
      const initFlutterApp = async () => {
        if (!isRendered) return;
        const engineInitializer = await new Promise((resolve) => {
          console.log("setup Flutter engine initializer...");
          _flutter.loader.loadEntrypoint({
            entrypointUrl: src,
            onEntrypointLoaded: resolve,
          });
        });
        if (!isRendered) return;

        console.log("initialize Flutter engine...");
        const appRunner = await engineInitializer?.initializeEngine({
          hostElement: target,
          assetBase: assetBase,
        });
        if (!isRendered) return;

        console.log("run Flutter engine...");
        await appRunner?.runApp();
      };
      initFlutterApp();

      const eventListener = (event) => {
        let state = event.detail;
        onFlutterAppLoaded(state);
      };

      target?.addEventListener("flutter-initialized", eventListener, {
        once: true,
      });

      return () => {
        isRendered = false;
        target?.removeEventListener("flutter-initialized", eventListener);
      };
    }, []);

    useEffect(() => {
      flutterState.current?.setText(text);
    }, [text]);
    useEffect(() => {
      flutterState.current?.setColor(color);
    }, [color]);
    useEffect(() => {
      flutterState.current?.setClicks(clicks);
    }, [clicks]);
    useEffect(() => {
      flutterState.current?.setSessionExpired(sessionExpired);
    }, [sessionExpired]);

    return (
      <div ref={ref} style={divStyle}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      </div>
    );
  }
);

export default FlutterView;
