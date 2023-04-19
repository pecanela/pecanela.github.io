document.getElementById('cube').addEventListener('click', function() {
    this.style.animation = '';
    void this.offsetWidth;
    this.style.animation = 'roll 2s infinite';
  });
  