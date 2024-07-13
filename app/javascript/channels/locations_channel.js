import consumer from "channels/consumer";

consumer.subscriptions.create("LocationsChannel", {
  connected() {
    console.log("Connected to LocationsChannel");
  },
  
  disconnected() {
    console.log("Disconnected from LocationsChannel");
  },
  
  received(data) {
    console.log("Received data:", data);
    if (window.updateMap) {
      window.updateMap(data);
    } else {
      console.error("updateMap function is not defined.");
    }
  }
});