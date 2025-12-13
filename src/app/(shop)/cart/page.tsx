"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FloatingInput from "../../../components/ui/FloatingInput";
import AddressSelect from "../../../components/ui/AddressSelect";
import DeliveryMethod, { ShippingMethod } from "../../../components/ui/DeliveryMethod";
import PayMethod from "../../../components/ui/PayMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import AddressSelectBox from "../../../components/ui/AddressSelectBox";
import { useToastMessage } from "../../../../hooks/useToastMessage";
import { getCurrentUser } from "../../../actions/auth";
import { ArrowLeft, PackageSearch } from "lucide-react";

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
  sizeId?: number;
};
type Province = { code: number; name: string };
type Ward = { code: number; name: string };


export default function PayContent() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sdt, setSdt] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [forceValidate, setForceValidate] = useState(false);
  const [refreshAddress, setRefreshAddress] = useState(false);
  const [addressResetKey, setAddressResetKey] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [shippingFee, setShippingFee] = useState<number>(20000);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("delivery")
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);

  const [customer, setCustomer] = useState<{
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
  } | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      // Gọi Server Action
      const userData = await getCurrentUser();

      if (userData) {
        // console.log("User đang đăng nhập:", userData);
        setUser(userData);
        setCustomer(prev => {
          if (prev) {
            return { ...prev, id: Number(userData.id) };
          }

          // Nếu prev là null → tạo object mới
          return {
            id: Number(userData.id),
            fullName: userData.name || "",
            email: String(userData.email) || "",
            phone: "",
            dateOfBirth: "",
            gender: "",
          };
        });

      } else {
        console.log("Chưa đăng nhập");
      }
    };

    checkAuth();
  }, []);
  const { showSuccess, showError, showInfo, showConfirm } = useToastMessage();


  useEffect(() => {
    console.log("selectedProvince: ", selectedProvince);
  }, [selectedProvince])

  useEffect(() => {
    console.log("selectedWard: ", selectedWard);
  }, [selectedWard])



  // Sửa lại useEffect đang bị lỗi
  useEffect(() => {
    // 1. Kiểm tra ID thay vì kiểm tra object customer
    // Dùng Optional Chaining (?.) để tránh lỗi nếu customer là null
    const customerId = customer?.id;

    if (!customerId) return;

    const fetchCustomer = async () => {
      // Lúc này chắc chắn customerId đã có
      const customerData = await loadCustomerById(customerId);

      if (customerData) {
        // Logic này vẫn setCustomer, nhưng vì useEffect bên dưới 
        // chỉ nghe 'customer.id' (vốn không đổi), nên nó sẽ KHÔNG chạy lại loop.
        setCustomer(prev => ({ ...prev, ...customerData })); // Merge data an toàn hơn
        setName(customerData.fullName || "");
        setEmail(customerData.email || "");
        setSdt(customerData.phone || "");
      }
    };

    fetchCustomer();
    // loadOrderByCustomerId(customerId);
    loadCartByCustomerId(customerId);

    // 2. QUAN TRỌNG: Chỉ thêm 'customer.id' vào dependency
  }, [customer?.id]);


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

  const loadProductById = async (productId: number, targetSizeId?: number) => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Không lấy được sản phẩm');

      const productData = await res.json();
      let displaySize = 'FreeSize'; // Giá trị mặc định

      if (productData.sizes && productData.sizes.length > 0) {
        if (targetSizeId) {
          // Nếu có ID size từ giỏ hàng -> Tìm tên size đúng với ID đó
          const foundSize = productData.sizes.find((s: any) => s.sizeId === targetSizeId);
          displaySize = foundSize ? foundSize.sizeName : productData.sizes[0].sizeName;
        } else {
          // Nếu không có (load trang chi tiết) -> Lấy size đầu tiên
          displaySize = productData.sizes[0].sizeName;
        }
      }
      // Map dữ liệu về Product type cho UI
      const mappedProduct: Product = {
        id: productData.id,
        name: productData.name,
        size: displaySize, // lấy size đầu tiên
        price: productData.price,
        img: productData.images?.[0]?.imageUrl || 'https://via.placeholder.com/60',
        quantity: 1,
        // sizeId: targetSizeId,
      };

      return mappedProduct;
    } catch (error) {
      console.error('Load product error:', error);
      return null;
    }
  };

  // Giả sử bạn có state này để lưu danh sách hiển thị
  // const [cartProducts, setCartProducts] = useState<any[]>([]);

  const loadCartByCustomerId = async (customerId: number) => {
    try {
      // BƯỚC 1: Lấy danh sách item trong giỏ (gồm productId, quantity, sizeId)
      const res = await fetch(`/api/cartdetails/${customerId}`);
      if (!res.ok) throw new Error("Lỗi fetch giỏ hàng");

      const cartItems = await res.json(); // Mảng các item trong giỏ
      console.log(cartItems);
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setProducts([]); // Giỏ hàng rỗng
        return;
      }

      // BƯỚC 2: Lấy chi tiết từng sản phẩm và gộp dữ liệu
      const productsFromCart = await Promise.all(
        cartItems.map(async (cartItem: any) => {
          // Gọi hàm lấy chi tiết sản phẩm (giả sử bạn đã có hàm này)
          const productDetail = await loadProductById(cartItem.productId, cartItem.sizeId);

          if (productDetail) {
            // QUAN TRỌNG: Map dữ liệu từ giỏ hàng vào interface Product
            const mappedProduct: Product = {
              ...productDetail, // Lấy toàn bộ thông tin gốc (tên, giá, ảnh...)

              // Ghi đè các trường quan trọng từ giỏ hàng:
              quantity: cartItem.quantity, // Số lượng khách muốn mua
              size: productDetail.size,     // Size khách đã chọn
              sizeId: cartItem.sizeId,
              // Các trường bắt buộc khác của interface (nếu productDetail thiếu)
              // status: productDetail.status || 1, 
            };
            return mappedProduct;
          }
          return null;
        })
      );
      console.log(productsFromCart);
      // Lọc bỏ null và ép kiểu về Product[]
      setProducts(productsFromCart.filter((p): p is Product => p !== null));

    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  };
  // const loadOrderByCustomerId = async (customerId: number) => {
  //   try {
  //     const res = await fetch(`/api/orders/${customerId}`);
  //     if (!res.ok) throw new Error("Failed to fetch orders");

  //     const orders = await res.json();

  //     if (orders.length === 0) return;

  //     const firstOrder = orders[0];

  //     // Lấy chi tiết từng product từ API products/[id]
  //     const productsFromOrder: Product[] = await Promise.all(
  //       firstOrder.details.map(async (d: any) => {
  //         const product = await loadProductById(d.productId);
  //         if (product) product.quantity = d.quantity; // set quantity từ order
  //         return product;
  //       })
  //     );

  //     setProducts(productsFromOrder.filter(p => p !== null) as Product[]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };




  const handleSubmit = async () => {
    // showInfo("HAHAHH");
    if (products.length === 0) {
      showInfo("Giỏ hàng đang trống, vui lòng thêm sản phẩm!");
      return;
    }

    if (!selectedAddressId) {
      showInfo("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    const confirm = await showConfirm("Bạn có chắc chắn muốn đặt hàng không?");
    if (!confirm) return;
    setIsOrdering(true);
    try {
      const res = await fetch(`/api/order-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customer?.id,
          addressId: selectedAddressId, // ID địa chỉ lấy từ component con
          items: products,              // Danh sách sản phẩm
          totalCost: total,          // Tổng tiền
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showError(data.message || "Đặt hàng thất bại");
        throw new Error(data.message || "Đặt hàng thất bại");
      }

      // 5. Xử lý Thành công
      showSuccess(`Đặt hàng thành công`);
      localStorage.removeItem("cartCount");
      // Clear giỏ hàng ở Client
      setProducts([]);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      showError(error.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setIsOrdering(false);
    }


  };

  const handleQuantityChange = async (productId: number, sizeId: number, delta: number) => {
    // 1. Tìm sản phẩm trong danh sách hiện tại để lấy số lượng cũ
    const currentProduct = products.find(p => p.id === productId && p.sizeId === sizeId);
    if (!currentProduct) return;

    const newQuantity = currentProduct.quantity + delta;

    // Không cho phép số lượng < 1
    if (newQuantity < 1) return;

    // 2. Cập nhật Giao diện NGAY LẬP TỨC (Optimistic Update)
    setProducts((prev) =>
      prev.map((p) =>
        // So sánh cả ID và Size để cập nhật đúng dòng
        (p.id === productId && p.sizeId === sizeId)
          ? { ...p, quantity: newQuantity }
          : p
      )
    );

    // 3. Gọi API để lưu xuống Database (Gửi ngầm)
    // Giả sử bạn có biến customer.id
    if (customer?.id) {
      try {
        // Sử dụng Debounce ở đây sẽ tốt hơn, nhưng gọi trực tiếp vẫn ổn với quy mô nhỏ
        await fetch('/api/carts/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: customer.id,
            productId: productId,
            sizeId: sizeId,
            quantity: newQuantity
          })
        });
        // Nếu muốn chắc chắn, có thể check res.ok, nếu lỗi thì setProducts lại giá trị cũ
      } catch (error) {
        console.error("Lỗi cập nhật số lượng:", error);
        // Rollback (hoàn tác) nếu cần thiết
        // setProducts(...) 
      }
    }
  };

  // Xóa sản phẩm
  const handleDelete = async (productId: number, sizeId: number) => {
    // A. Cập nhật UI ngay lập tức (Optimistic Update)
    setProducts((prev) => prev.filter((p) => {
      // Giữ lại các sản phẩm nếu:
      // ID khác nhau HOẶC Size khác nhau
      // (Nghĩa là chỉ xóa cái nào trùng cả ID và Size)
      return !(p.id === productId && p.sizeId === sizeId);
    }));

    // B. Gọi API xóa dưới Database
    // Giả sử bạn có biến customer?.id từ context hoặc props
    if (customer?.id) {
      try {
        await fetch('/api/carts/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: customer.id,
            productId: productId,
            sizeId: sizeId // Gửi sizeId lên server
          })
        });

        // Nếu bạn dùng Context để đếm số lượng trên Header, hãy gọi nó ở đây
        // removeFromCart(productId, quantity, sizeId); 
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        // Có thể load lại giỏ hàng nếu lỗi
      }
    }
  };

  // PayContent.tsx

  const handleAddCustomerAddress = async () => {
    if (!houseNumber || !selectedProvince || !selectedWard) {
      // alert("Vui lòng điền đầy đủ thông tin địa chỉ");
      showError("Vui lòng điền đầy đủ thông tin địa chỉ")
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

      // alert("Thêm địa chỉ thành công!");
      showSuccess("Thêm địa chỉ thành công")

    } catch (err) {
      console.error(err);
      // alert("Thêm địa chỉ thất bại!");
      showError("Thêm địa chỉ thất bại");
    }
  };


  const handleShippingChange = (method: ShippingMethod, fee: number) => {
    setShippingFee(fee);
    setShippingMethod(method);
  }
  // Tính tổng tạm tính
  const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const total = subtotal + shippingFee;

  return (
    <div className="flex justify-center items-stretch">
      {/* LEFT SIDE - DELIVERY INFO */}
      <div className="w-full lg:w-[55%] flex flex-col justify-start items-center lg:items-end bg-white min-h-screen">

        {/* Inner Container: Giới hạn độ rộng tối đa để form không bị bè ra quá mức trên màn hình to */}
        <div className="w-full max-w-[640px] px-6 md:px-10 py-10 lg:pr-16">

          {/* HEADER SECTION */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Thông tin giao hàng</h3>

            {!customer && (
              <div className="mt-2 sm:mt-0 text-sm text-gray-500">
                Bạn đã có tài khoản?{" "}
                <a href="/login" className="text-orange-500 hover:text-orange-600 font-medium ml-1 transition">
                  Đăng nhập
                </a>
              </div>
            )}
          </div>

          {/* CUSTOMER INFO FIELDS */}
          <div className="space-y-4">
            <FloatingInput
              label="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Họ và tên"
              field="họ và tên"
              forceValidate={forceValidate}
            />

            <div className="grid grid-cols-1 sm:grid-cols-[65%_33%] gap-4">
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

          {/* ADDRESS SECTION - Có đường phân cách */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Địa chỉ giao hàng</h3>

            <div className="space-y-4">
              <FloatingInput
                label="Địa chỉ (Số nhà, đường...)"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Địa chỉ"
                field="địa chỉ"
                noValidate
              />

              <AddressSelect
                forceValidate={forceValidate}
                onChangeProvince={setSelectedProvince}
                onChangeWard={setSelectedWard}
                resetKey={addressResetKey}
              />

              {/* Nút thêm địa chỉ: Chuyển thành dạng Outline hoặc nhẹ hơn để không bị nhầm là nút Submit chính */}
              <button
                onClick={handleAddCustomerAddress}
                className="mt-2 w-full sm:w-auto px-6 py-2.5 border border-orange-500 text-orange-600 font-medium rounded hover:bg-orange-50 transition cursor-pointer text-sm"
              >
                + Thêm địa chỉ mới
              </button>
            </div>
          </div>

          {/* DELIVERY METHOD */}
          <div className="border-t border-gray-100">
            {/* <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"> */}
            <DeliveryMethod
              selectedMethod={shippingMethod}
              onMethodChange={handleShippingChange}
            />
            {/* </div> */}
          </div>

          {/* PAY METHOD */}
          {/* <div className="border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <PayMethod />
            </div>
          </div> */}
        </div>
      </div>

      {/* // Right Side - Order Summary */}
      < div className="w-full lg:w-[45%] bg-gray-50 border-l border-gray-200 flex flex-col h-full min-h-screen" >
        <div className="px-8 pt-10 pb-8 flex flex-col h-full">

          {/* PRODUCT LIST */}
          <div className="flex-1 min-h-[200px] max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2 space-y-6">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 h-full">
                <PackageSearch className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600">Giỏ hàng trống</p>
                <p className="text-sm text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ nhé!</p>

                <button
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm transition-all duration-200 cursor-pointer"
                  onClick={() => router.push("/")}
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              products.map((p) => (
                <div
                  key={`${p.id}-${p.size}`}
                  className="flex gap-4 relative group"
                >
                  {/* Image Wrapper with Badge */}
                  <div className="relative w-16 h-16 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden bg-white">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-0 -right-0 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity">
                      {p.quantity}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div className="flex justify-between items-start">
                      <div className="pr-6">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{p.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">Size: {p.size}</p>
                      </div>
                      {/* Delete Button - Styled clearer */}
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        onClick={() => handleDelete(p.id, p.sizeId)}
                        title="Xóa sản phẩm"
                      >
                        <FontAwesomeIcon icon={faX} size="xs" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      {/* Modern Quantity Selector */}
                      <div className="flex items-center border border-gray-300 rounded-md bg-white h-7">
                        <button
                          className="px-2 text-gray-600 hover:bg-gray-100 h-full rounded-l-md transition cursor-pointer"
                          onClick={() => handleQuantityChange(p.id, p.sizeId, -1)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={p.quantity === 0 ? "" : p.quantity}
                          className="w-8 text-center text-xs font-medium border-none focus:ring-0 p-0 text-gray-700 h-full"
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            // ... logic giữ nguyên ...
                            if (!isNaN(val) && val >= 1) {
                              setProducts((prev) =>
                                prev.map((prod) =>
                                  prod.id === p.id ? { ...prod, quantity: val } : prod
                                )
                              );
                            } else if (e.target.value === "") {
                              setProducts((prev) =>
                                prev.map((prod) =>
                                  prod.id === p.id ? { ...prod, quantity: 0 } : prod
                                )
                              );
                            }
                          }}
                        />
                        <button
                          className="px-2 text-gray-600 hover:bg-gray-100 h-full rounded-r-md transition cursor-pointer"
                          onClick={() => handleQuantityChange(p.id, p.sizeId, 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-sm font-semibold text-gray-700">{formatPrice(p.price)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SEPARATOR */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* PAYMENT & TOTAL SECTION */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính</span>
              <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="font-medium text-gray-800">{formatPrice(shippingFee)}</span>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center">
              <span className="text-base font-medium text-gray-800">Tổng cộng</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500 font-normal">VND</span>
                <span className="text-xl font-bold text-orange-600 tracking-tight">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          {/* ADDRESS SELECTOR (Logic giữ nguyên) */}
          <div className="mt-6">
            {customer && customer.id ? (
              <AddressSelectBox
                customerId={customer.id}
                refresh={refreshAddress}
                onAddressSelect={(id) => setSelectedAddressId((id))}
              />
            ) : (
              <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="cursor-pointer mt-10 mb-10 flex flex-col items-center gap-4">
            <button
              suppressHydrationWarning
              onClick={handleSubmit}
              className="cursor-pointer w-full h-[56px] bg-orange-600 text-white text-lg font-bold rounded-md hover:bg-orange-700 shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer flex justify-center items-center"
              disabled={isOrdering}
            >
              {isOrdering ? "Đang xử lý..." : "Đặt hàng"}
            </button>

            <a href="/" className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1 transition">
              <span className="text-lg"><ArrowLeft size={17} /></span> Quay lại trang chủ
            </a>
          </div>

        </div>
      </div >
    </div >
  );
}
