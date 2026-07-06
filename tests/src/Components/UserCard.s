@Component
@Title("UserCard")

@Template
<div class="user-card">
  <div class="avatar">@name.charAt(0)</div>
  <div class="info">
    <h3>@name</h3>
    <p>@email</p>
  </div>
</div>

@Code
@property name = 'User'
@property email = 'user@example.com'

@Style
.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f8f9fa;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.info h3 {
  margin: 0 0 5px 0;
}

.info p {
  margin: 0;
  color: #666;
}
