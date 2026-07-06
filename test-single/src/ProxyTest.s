@Component

@Template
<div class="proxy-test">
  <h3>Proxy Test</h3>
  <div>Value: @value</div>
</div>

@Code
value = 0;

onMounted() {
  setTimeout(() => {
    this.value = 100;
  }, 100);
}

@Style
