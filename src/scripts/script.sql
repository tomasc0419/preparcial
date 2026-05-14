INSERT INTO role (
  id,
  role_name,
  description,
  created_at
)
VALUES (
  gen_random_uuid(),
  'admin',
  'Administrador',
  NOW()
);

INSERT INTO role (
  id,
  role_name,
  description,
  created_at
)
VALUES (
  gen_random_uuid(),
  'doctor',
  'Doctor role',
  NOW()
);

SELECT * FROM role;

SELECT * FROM "user";

SELECT * FROM user_roles_role;