import MenuShow from "../components/MenuShow";

const Home = () => {
  return (
    <div className="container mx-auto py-6">
      <div>
        <h2 className="text-[20px] font-bold mb-2">Copy Of Sample Menu</h2>
        <p className="text-[16px] font-semibold mb-[5px]">Your happy place</p>
        <p className="text-[14px] font-light">20% VAT included to all prices</p>
      </div>
      <MenuShow />
    </div>
  );
};

export default Home;
