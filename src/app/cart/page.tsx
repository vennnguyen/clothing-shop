"use client";

import { useEffect, useState } from "react";
import FloatingInput from "./../../components/ui/FloatingInput";
import AddressSelect from "./../../components/ui/AddressSelect";
import DeliveryMethod from "./../../components/ui/DeliveryMethod";
import PayMethod from "./../../components/ui/PayMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import AddressSelectBox from "../../components/ui/AddressSelectBox";

function formatPrice(priceNumber: number, locale: string = "vi-VN") {
  if (priceNumber == null) return "";
  return priceNumber.toLocaleString(locale) + "₫";
}

type Product = {
  id: number;
  name: string;
  size: string;
  price: number;
  img: string;
  quantity: number;
};
type Province = { code: number; name: string };
type Ward = { code: number; name: string };


export default function PayContent() {
  const [products, setProducts] = useState<Product[]>([
    // {
    //   id: 1,
    //   name: "SWE DREAMER FLATTOP CAP - BEIGE",
    //   size: "S",
    //   price: 100000,
    //   img: "https://cdn.hstatic.net/products/1000344185/1_8c1c7a7c142b4cc69f1c68916327a031_large.jpg",
    //   quantity: 1,
    // },
    // {
    //   id: 2,
    //   name: "ANOTHER PRODUCT",
    //   size: "M",
    //   price: 150000,
    //   img: "https://cdn.hstatic.net/products/1000344185/1_8c1c7a7c142b4cc69f1c68916327a031_large.jpg",
    //   quantity: 2,
    // },
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [forceValidate, setForceValidate] = useState(false);
  const [refreshAddress, setRefreshAddress] = useState(false);
  const [addressResetKey, setAddressResetKey] = useState(0);
  const [customer, setCustomer] = useState<{
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
} | null>(null);


  useEffect(()=>{
    console.log("selectedProvince: ",selectedProvince);
  },[selectedProvince])

  useEffect(()=>{
    console.log("selectedWard: ",selectedWard);
  },[selectedWard])

 

useEffect(() => {
  const customerId = 1;

  const fetchCustomer = async () => {
    const customerData = await loadCustomerById(customerId);
    if (customerData) {
      setCustomer(customerData); // lưu customer toàn bộ
      setName(customerData.fullName || "");
      setEmail(customerData.email || "");
      setSdt(customerData.phone || "");
    }
  };

  fetchCustomer();
  loadOrderByCustomerId(customerId);
}, []);


    const loadCustomerById = async (id: number) => {
      try {
        const res = await fetch(`/api/customers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch customer");

        const customer = await res.json();
        console.log("Customer info:", customer);
        return customer;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    const loadProductById = async (productId: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Không lấy được sản phẩm');

      const productData = await res.json();

      // Map dữ liệu về Product type cho UI
      const mappedProduct: Product = {
        id: productData.id,
        name: productData.name,
        size: productData.sizes?.[0]?.sizeName || 'M', // lấy size đầu tiên
        price: productData.price,
        img: productData.images?.[0]?.imageUrl || 'https://via.placeholder.com/60',
        quantity: 1,
      };

      return mappedProduct;
    } catch (error) {
      console.error('Load product error:', error);
      return null;
    }
  };

  const loadOrderByCustomerId = async (customerId: number) => {
  try {
    const res = await fetch(`/api/orders/${customerId}`);
    if (!res.ok) throw new Error("Failed to fetch orders");

    const orders = await res.json();

    if (orders.length === 0) return;

    const firstOrder = orders[0];
    
    // Lấy chi tiết từng product từ API products/[id]
    const productsFromOrder: Product[] = await Promise.all(
      firstOrder.details.map(async (d: any) => {
        const product = await loadProductById(d.productId);
        if (product) product.quantity = d.quantity; // set quantity từ order
        return product;
      })
    );

    setProducts(productsFromOrder.filter(p => p !== null) as Product[]);
  } catch (err) {
    console.error(err);
  }
};



  const handleSubmit = () => {
    setForceValidate((prev) => !prev);
  };

  // Tăng/Giảm số lượng
  const handleQuantityChange = (id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(p.quantity + delta, 1) } : p
      )
    );
  };

  // Xóa sản phẩm
  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

// PayContent.tsx

const handleAddCustomerAddress = async () => {
  if (!houseNumber || !selectedProvince || !selectedWard) {
    alert("Vui lòng điền đầy đủ thông tin địa chỉ");
    setForceValidate(true);
    return;
  }

  if (!customer?.id) {
    alert("Không tìm thấy khách hàng");
    return;
  }

  try {
    const payload = { 
      customerId: customer.id || 1,
      houseNumber,
      ward: selectedWard.name,
      city: selectedProvince.name,
      isDefault: true,
    };

    const res = await fetch(`/api/customeraddress/${payload.customerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Thêm địa chỉ thất bại");

    // Reload AddressSelectBox
    setRefreshAddress((prev) => !prev);

    // Reset form
    setHouseNumber("");
    setSelectedProvince(null);
    setSelectedWard(null);
    setForceValidate(false);
    setAddressResetKey(prev => prev + 1);

    alert("Thêm địa chỉ thành công!");
  } catch (err) {
    console.error(err);
    alert("Thêm địa chỉ thất bại!");
  }
};



  // Tính tổng tạm tính
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingFee = 3000;
  const total = subtotal + shippingFee;

  return (
    <div className="flex justify-center items-stretch">
      {/* LEFT SIDE */}
      <div className="w-[55%] flex justify-end pr-[100px]">
        <div className="w-[75%] pt-[60px]">
          <h3 className="font-medium leading-none">Thông tin giao hàng</h3>
          <div className="pt-3">
            {!customer && <p>
              Bạn đã có tài khoản ?
              <a href="/login" className="text-blue-500">
                Đăng nhập
              </a>
            </p> }
            
            <div className="w-full mt-3">
              <FloatingInput
                label="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ và tên"
                field="họ và tên"
                forceValidate={forceValidate}
              />
              <div className="grid grid-cols-[70%_1fr] gap-3 mt-3">
                <FloatingInput
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  field="email"
                  forceValidate={forceValidate}
                />
                <FloatingInput
                  label="SĐT"
                  value={sdt}
                  onChange={(e) => setSdt(e.target.value)}
                  placeholder="SĐT"
                  field="SĐT"
                  forceValidate={forceValidate}
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="mt-5">
              <h3 className="pb-5 text-lg font-medium">Thêm địa chỉ giao hàng</h3>
              <FloatingInput
                label="Địa chỉ"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Địa chỉ"
                field="địa chỉ"
                forceValidate={forceValidate}
              />
              
              <AddressSelect
                forceValidate={forceValidate}
                onChangeProvince={setSelectedProvince}
                onChangeWard={setSelectedWard}
                resetKey={addressResetKey} // ← thêm dòng này
              />

              <button 
              onClick={handleAddCustomerAddress}
              className=" mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">
                Thêm địa chỉ
              </button>
            </div>

            {/* Delivery Method */}
            <DeliveryMethod />

            {/* Pay Method */}
            <PayMethod />

            {/* Footer Step */}
            <div className="grid grid-cols-2 items-center gap-3 mt-5 mb-5">
              <a href="/" className="text-blue-500 hover:text-blue-700">
                Trang chủ
              </a>
              <button
                onClick={handleSubmit}
                className="h-[50px] w-full bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
              >
                Hoàn tất đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-[#71717115] w-[45%] border-l border-[#717171be] flex pl-[30px]">
        <div className="w-[75%] pt-[60px]">
          {/* PRODUCT LIST */}
          <div className="max-h-[280px] border-b-2 border-gray-300 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400 space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center relative py-5 border-b border-dotted border-gray-300"
              >
                <img src={p.img} className="w-[60px] h-[60px] rounded border" />
                <div className="flex flex-col justify-between flex-1 ml-4">
                  <span className="text-[#4b4b4b] font-medium text-[14px]">{p.name}</span>
                  <span className="text-[#969696] text-[14px]">{p.size}</span>
                  <span className="text-[#484848] text-[14px]">{formatPrice(p.price)}</span>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="w-6 h-6 bg-gray-200 text-black rounded text-center cursor-pointer"
                      onClick={() => handleQuantityChange(p.id, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={p.quantity === 0 ? "" : p.quantity}
                      className="w-12 h-6 text-center border border-gray-300"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1) {
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, quantity: val } : prod
                            )
                          );
                        } else if (e.target.value === "") {
                          // tạm thời cho phép xóa input để nhập lại
                          setProducts((prev) =>
                            prev.map((prod) =>
                              prod.id === p.id ? { ...prod, quantity: 0 } : prod
                            )
                          );
                        }
                      }}
                    />
                    <button
                      className="w-6 h-6 bg-gray-200 text-black rounded text-center cursor-pointer"
                      onClick={() => handleQuantityChange(p.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delete */}
                <button
                  className="absolute top-4.5 right-1.5 text-red-500 cursor-pointer"
                  onClick={() => handleDelete(p.id)}
                >
                  <FontAwesomeIcon icon={faX}></FontAwesomeIcon>
                </button>
              </div>
            ))}
          </div>

          {/* PAYMENT SECTION */}
          <div className="border-b-2 border-gray-300 py-6">
            <div className="flex justify-between py-2">
              <p className="text-[#717171]">Tạm tính</p>
              <span className="text-[#4b4b4b]">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between py-2">
              <p className="text-[#717171]">Phí vận chuyển</p>
              <span className="text-[#4b4b4b]">{formatPrice(shippingFee)}</span>
            </div>
          </div>

          {/* TOTAL */}
          <div className="flex justify-between py-4">
            <p className="text-[#484848] text-[16px]">Tổng cộng</p>
            <span className="text-[#484848] text-[24px]">
              <span className="text-[12px] text-gray-500 pr-2">VND</span>
              {formatPrice(total)}
            </span>
          </div>

          <AddressSelectBox customerId={customer?.id || 1} refresh={refreshAddress} />

          {/* NOTE */}
          <div className="bg-[#f3f4f4] p-5 mt-4 flex flex-col">
            <label className="text-[#666] font-semibold mb-2">Ghi chú đơn hàng</label>
            <textarea
              className="border border-gray-200 resize-none p-3 h-[150px] text-[#666] text-[15px] rounded bg-white"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
