# Cuentas y administracion: primera etapa

## Estado actual

Se preparo Supabase Auth con Google, sesiones con cookies, acceso a /cuenta,
panel /admin y una migracion SQL con permisos por fila y auditoria.
No se ha creado ni conectado un proyecto externo. No se importo inventario.
El catalogo publico sigue usando data/productos.js; editar la futura tabla de
Supabase no cambia ese catalogo hasta completar su integracion.
Los pedidos todavia no se guardan en la base de datos. WhatsApp sigue siendo
una solicitud de compra, no un pedido confirmado ni una reserva de existencias.
No habilitar ventas reales antes de validar precios, stock y envio en el servidor.
La auditoria de npm detecto 16 alertas en dependencias (incluida una critica).
Antes del lanzamiento revisar/actualizar estas dependencias y volver a ejecutar
las pruebas. No se aplicaron actualizaciones forzadas que pudieran romper el proyecto.

## Activacion

1. Crear un proyecto en Supabase dentro de la cuenta del propietario.
2. Ejecutar supabase/migrations/001_accounts_products.sql en el SQL Editor una sola vez.
3. En Google Cloud, configurar OAuth (aplicacion web). Usar como URI de redireccion
   la URL de callback que muestra el proveedor Google de Supabase:
   https://TU-PROYECTO.supabase.co/auth/v1/callback.
4. Activar Google en Authentication > Providers con su Client ID y Client Secret.
   Mantener desactivados otros proveedores y los usuarios anonimos.
5. Configurar Site URL y Redirect URLs en Supabase. Permitir exactamente
   http://localhost:3001/auth/callback y la URL /auth/callback del dominio de produccion.
   Si Google esta en modo de prueba, agregar las cuentas que van a probar el acceso.
6. Agregar a .env.local las variables de .env.example sin borrar las existentes.
   Usar Project URL y Publishable Key; nunca usar una clave secret/service_role
   en NEXT_PUBLIC_* ni subir secretos a GitHub. SITE_URL debe ser el origen de
   la pagina (http://localhost:3001 en desarrollo, https://DOMINIO en produccion).
7. Reiniciar el servidor. En produccion configurar tambien las variables del hosting.
8. Iniciar sesion con la cuenta de Google del administrador.
9. Ejecutar supabase/autorizar-administrador.sql desde el SQL Editor. Si la consulta
   final no devuelve esa cuenta, comprobar que ya inicio sesion con Google.
10. Entrar a /admin. Ningun usuario puede concederse permisos desde la pagina.

## Pruebas antes de conectar el inventario

- Sin configuracion: la tienda funciona, /acceso explica que el acceso aun no esta disponible.
- Sin sesion: /cuenta y /admin redirigen al acceso.
- Google: probar aceptar, cancelar y cerrar sesion; probar celular y computadora.
- Cliente: no puede abrir /admin ni editar productos por la API de Supabase.
- Administrador: puede abrir /admin y editar un producto de prueba, con registro de auditoria.
- Dos ediciones simultaneas: la segunda no debe sobrescribir datos desactualizados.
- Verificar desde clientes con clave publica y JWT de prueba que RLS bloquea
  escrituras a administradores/auditoria y acceso a perfiles ajenos.

## Siguiente etapa

Revisar el Excel del punto de venta y sus codigos, importar una muestra y
conectar el catalogo a productos. Despues implementar pedidos transaccionales,
validacion de existencias y sincronizacion con las ventas de la tienda fisica.

Referencias oficiales:
- https://supabase.com/docs/guides/auth/server-side/creating-a-client
- https://supabase.com/docs/guides/auth/social-login/auth-google
