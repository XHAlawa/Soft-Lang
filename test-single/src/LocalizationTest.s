@Component

@Template
<div>
  <h3>Localization Test</h3>
  <p>@L('welcome')</p>
  <p>@L('greeting')</p>
  <button @click="changeLanguage">Change Language</button>
</div>

@Code
changeLanguage() {
  console.log('Language changed');
}

@Style
