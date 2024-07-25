import consumer from "channels/consumer";

consumer.subscriptions.create("LocationsChannel", {
  connected() {
    console.log("Connected");
    document.getElementById('connection-status').classList.add('connected');
  },
  
  disconnected() {
    console.log("Disconnected");
    document.getElementById('connection-status').classList.remove('connected');
  },
  
  received(data) {
    console.log("Received data:", data);
    if (window.updateMap) {
      window.updateMap(data);
    } else {
      console.error("error");
    }
  }
});