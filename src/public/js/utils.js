//Get Card Id para el proyecto, solamente adquiere el ID del cart, pero se puede obtener todos los datos de sesión del usuario.

const getCartId = async () => {
  try {
    const response = await fetch("../api/sessions/current", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error("Usuario no logueado");
        return null;
      }
      throw new Error(
        `Error al obtener los datos del usuario: ${response.statusText}`
      );
    }

    const data = await response.json();

    return data.cart._id;
  } catch (error) {
    console.error("Error de servidor:", error.message);
  }
};

//Función de cantidad total en el carrito para obtener el cart count.
const getQT = async () => {
  const cartId = await getCartId();
  if (cartId) {
    try {
      const response = await fetch(`/api/carts/${cartId}/QT`);
      if (response.ok) {
        const data = await response.json();
        cartCount.innerText = data.totalProductos;
      } else {
        console.error(`Error al cargar QT: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  } else {
    cartCount.innerText = 0;
  }
};

//Tostify alerts para todo el proyecto, se carga en main.handlebars.

function tostada(texto) {
  Toastify({
    text: texto,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: {
      background: "#cc7f53",
      color: "black",
    },
  }).showToast();
}
