import Cart from '../components/Cart';

export default function Home() {
  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-4xl mb-8 text-blue-600 font-extrabold text-center">Checkout</h1>
        <Cart />
      </div>
    </main>
  );
}
