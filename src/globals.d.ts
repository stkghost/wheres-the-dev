//declarando tipagem para o navigation - corrigindo erro de IDE
declare var navigator: {
  geolocation: {
    getCurrentPosition: (position: any, error: any ) => void
  }
};