# Servicio de E-Commerce de Libros
servicio de e-commerce de libros, donde usuarios pueden vender sus
libros usados y comprar libros usados de otros usuarios.

## Operaciones Basicas de Almacenamiento a Desarrollar

  - **Create**: Debe crear una entrada en la base de datos con los datos enviados al backend
  - **Read**: Debe poderse buscar en unidad o en cantidad.
            - Para los usuarios, no se necesita busqueda en cantidad.
            - Para los libros, debe poderse filtrar por genero, fecha de publicación, casa editorial, autor y nombre.
            - Para los pedidos, debe poderse filtrar por fecha de creación (entre una y otra fecha), y por estado del pedido (en progreso, completado, cancelado)
  - **Update**: Debe modificar una entrada en la base de datos con los datos enviados al backend.
  - **Delete**: Por motivos de seguridad, se debe realizar "soft deletes" , es decir, inhabilitar la entrada en la base de datos, en vez de borrarlo de la base de datos.

