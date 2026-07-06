@Component

@Template
<div>
  <h3>Multiple Events Test</h3>
  <button @click="handleClick" @mouseenter="handleEnter" @mouseleave="handleLeave">
    Hover and click me
  </button>
  <div>
    Clicks: @clickCount
    Enters: @enterCount
    Leaves: @leaveCount
  </div>
</div>

@Code
clickCount = 0;
enterCount = 0;
leaveCount = 0;

handleClick() {
  this.clickCount++;
}

handleEnter() {
  this.enterCount++;
}

handleLeave() {
  this.leaveCount++;
}

@Style
