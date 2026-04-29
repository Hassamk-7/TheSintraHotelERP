import { colors } from '@mui/material';
import React, { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const SintraThankYou = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const bookingResponse = location.state?.bookingResponse || null;
  const reservationData = location.state?.reservationData || null;
  const paymentStatus = searchParams.get('status');
  const basketId = searchParams.get('basket_id');

  const selectedRooms = reservationData?.selectedRooms || [];
  const selectedRoom = selectedRooms[0] || null;

  const bookingRef = bookingResponse?.reservationNumber || basketId || searchParams.get('bookingRef') || 'TSH-2205';
  const total = bookingResponse?.totalAmount || reservationData?.totals?.total || searchParams.get('total') || '21735';
  const voucher = reservationData?.voucher || null;
 const importantnotes = {
     backgroundColor: '#efefef',
  borderLeft: '5px solid #2B6379', // ✅ FIX
  paddingLeft: '10px',
  paddingTop: '10px', // ✅ FIX (camelCase)
  fontFamily: 'Arial, sans-serif', // ✅ FIX
  borderRadius: '5px', // ✅ FIX
  color: '#2B6379',
  fontSize: '14px',
  }
  const summary = useMemo(() => {
    const checkIn = bookingResponse?.checkInDate || reservationData?.checkIn || null;
    const checkOut = bookingResponse?.checkOutDate || reservationData?.checkOut || null;
    const inDate = checkIn ? new Date(checkIn) : null;
    const outDate = checkOut ? new Date(checkOut) : null;
    const validIn = inDate && !Number.isNaN(inDate.getTime()) ? inDate : null;
    const validOut = outDate && !Number.isNaN(outDate.getTime()) ? outDate : null;
    const nights = bookingResponse?.numberOfNights || reservationData?.totals?.nights || (validIn && validOut ? Math.max(1, Math.round((validOut - validIn) / (1000 * 60 * 60 * 24))) : 1);

    const subtotal = Number(bookingResponse?.subtotal ?? reservationData?.totals?.subtotal ?? 0);
    const taxes = Number(bookingResponse?.taxAmount ?? reservationData?.totals?.tax ?? 0);
    const discount = Number(bookingResponse?.discountAmount ?? reservationData?.totals?.discount ?? 0);
    const totalPaid = Number(bookingResponse?.totalPaid ?? reservationData?.totals?.advanceAmount ?? 0);
    const totalAmount = Number(bookingResponse?.totalAmount ?? reservationData?.totals?.total ?? total);
    const balance = totalAmount - totalPaid;
    const paymentStatus = bookingResponse?.paymentStatus || (paymentStatus === 'failed' ? 'Failed' : 'Confirmed');
    const paymentMethod = location.state?.paymentMethod || (totalPaid >= totalAmount ? 'online-payment' : 'pay-at-hotel');

   

    return {
      guestName: bookingResponse?.guestName || `${reservationData?.guestInfo?.firstName || ''} ${reservationData?.guestInfo?.lastName || ''}`.trim() || 'Guest',
      phone: bookingResponse?.guestPhone || reservationData?.guestInfo?.phone || 'N/A',
      email: bookingResponse?.guestEmail || reservationData?.guestInfo?.email || 'N/A',
      checkIn: validIn ? validIn.toLocaleDateString('en-US') : 'N/A',
      checkOut: validOut ? validOut.toLocaleDateString('en-US') : 'N/A',
      nights,
      bookingDate: (bookingResponse?.createdAt ? new Date(bookingResponse.createdAt) : new Date()).toLocaleDateString('en-US'),
      roomName: selectedRoom?.name || bookingResponse?.rooms?.[0]?.roomTypeName || 'Executive Room',
      roomImage: selectedRoom?.image || '/img/rooms/60.jpg',
      guests: `${bookingResponse?.numberOfAdults ?? reservationData?.adults ?? 1} Adults, ${bookingResponse?.numberOfChildren ?? reservationData?.children ?? 0} Children`,
      subtotal,
      taxes,
      discount,
      totalAmount,
      totalPaid,
      balance,
      paymentLabel: paymentStatus === 'Failed' || paymentStatus === 'failed' ? 'Payment Failed / Pending' : (paymentStatus === 'Paid' || paymentStatus === 'paid' ? 'Paid' : paymentStatus),
      paymentMethodLabel: paymentMethod === 'online-payment' ? 'Online Payment (PayFast)' : 'Pay at Hotel (25% Deposit)',
      arrivalTime: reservationData?.guestInfo?.arrival || bookingResponse?.checkinNotes?.replace('Arrival Time: ', '') || ''
    };
  }, [bookingResponse, reservationData, selectedRoom, paymentStatus, total, location.state?.paymentMethod]);



  return (
    <>
      <div className="banner-header section-padding valign bg-img" data-overlay-dark="4" data-background="/img/slider/sub.png" style={{ backgroundImage: 'url(/img/slider/sub.png)', backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 caption mt-90 text-left">
              <span>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
                <i className="star-rating"></i>
              </span>
              <h1>Book Luxury Hotel in Islamabad</h1>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="booking-container">
  <div className="row g-3">
    {/* Booking Details */}
    <div className="col-md-7 booking-details bg-white p-3">
      <div className="row g-2">
        {/* Personal Information Section */}
        <div className="col-12">
          <h5 style={{ fontSize:'20px', color: '#2B6379', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #2B6379', paddingBottom: '5px' }}>
            Personal Information
          </h5>
        </div>
        <div className="col-12 col-md-6">
          <strong>Guest Name: </strong> <em>{summary.guestName}</em>
        </div>
        <div className="col-12 col-md-6">
          <strong>Phone: </strong> {summary.phone}
        </div>
        {reservationData?.guestInfo?.email && (
          <div className="col-12 col-md-6">
            <strong>Email: </strong> {reservationData.guestInfo.email}
          </div>
        )}
        {reservationData?.guestInfo?.address && (
          <div className="col-12 col-md-6">
            <strong>Address: </strong> {reservationData.guestInfo.address}
          </div>
        )}
        
        {/* Booking Information Section */}
        <div className="col-12 mt-3">
          <h5 style={{ fontSize:'20px', color: '#2B6379', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #2B6379', paddingBottom: '5px' }}>
            Booking Information
          </h5>
        </div>
        <div className="col-12 col-md-6">
          <strong>Booking Ref: </strong> <span style={{ color: '#2B6379', fontWeight: 'bold' }}>{bookingRef}</span>
        </div>
        <div className="col-12 col-md-6">
          <strong>Booking Date: </strong> {summary.bookingDate}
        </div>
        <div className="col-12 col-md-6">
          <strong>Check-in: </strong> {summary.checkIn}
        </div>
        <div className="col-12 col-md-6">
          <strong>Check-out: </strong> {summary.checkOut}
        </div>
        <div className="col-12 col-md-6">
          <strong>No. of Nights: </strong> {summary.nights}
        </div>
        <div className="col-12 col-md-6">
          <strong>Total Guests: </strong> {summary.guests}
        </div>
        {summary.arrivalTime && (
          <div className="col-12 col-md-6">
            <strong>Arrival Time: </strong> {summary.arrivalTime}
          </div>
        )}
        
        {/* Payment Information Section */}
        <div className="col-12 mt-3">
          <h3 style={{ fontSize:'20px', color: '#2B6379', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid #2B6379', paddingBottom: '5px' }}>
            Payment Information
          </h3>
        </div>
        <div className="col-12 col-md-6">
          <strong>Payment Method: </strong> {summary.paymentMethodLabel}
        </div>
        <div className="col-12 col-md-6">
          <strong>Payment Status: </strong> <span style={{ 
            color: summary.paymentLabel.includes('Paid') ? '#28a745' : summary.paymentLabel.includes('Failed') ? '#dc3545' : '#ffc107',
            fontWeight: 'bold'
          }}>{summary.paymentLabel}</span>
        </div>
        <div className="col-12 col-md-6">
          <strong>Subtotal: </strong> PKR {Math.round(summary.subtotal).toLocaleString()}
        </div>
        <div className="col-12 col-md-6">
          <strong>Taxes: </strong> PKR {Math.round(summary.taxes).toLocaleString()}
        </div>
        {summary.discount > 0 && (
          <div className="col-12 col-md-6">
            <strong>Voucher Discount: </strong> <span style={{ color: '#28a745' }}>PKR {Math.round(summary.discount).toLocaleString()}</span>
          </div>
        )}
        {summary.totalPaid > 0 && (
          <div className="col-12 col-md-6">
            <strong>Advance Paid: </strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>PKR {Math.round(summary.totalPaid).toLocaleString()}</span>
          </div>
        )}
        <div className="col-12 col-md-6">
          <strong>Total Amount: </strong> <span style={{ color: '#2B6379', fontWeight: 'bold', fontSize: '16px' }}>PKR {Math.round(summary.totalAmount).toLocaleString()}</span>
        </div>
        {summary.balance > 0 && (
          <div className="col-12 col-md-6">
            <strong>Balance Due at Hotel: </strong> <span style={{ color: '#dc3545', fontWeight: 'bold' }}>PKR {Math.round(summary.balance).toLocaleString()}</span>
          </div>
        )}
        {/* Important Notes */}
        <div className="col-12  mt-4" style={importantnotes}>
          <h2 style={{fontSize:'30px'}}>Important Notes</h2>
          <ul>
            <li>Party and loud gatherings are not allowed.</li>
            <li>Check-in time is 2PM. Guest before 2PM will be entertained in case of room availability.</li>
            <li>Check-out time is 12 (Noon), Guest will be charged fee after this time.</li>
            <li>Any damage to the property will be charged to the guest.</li>
             <li>Please contact our customer care team 24/7 at <strong>+(051) 8736313</strong></li>
              <li>Thanks for choosing Sintra Hotel, we wish you a pleasant stay!
</li>
          </ul>
          
        </div>
      </div>

      <div className="col-12 print-icon d-flex justify-content-end mt-3">
        
        
                <button 
                  onClick={() => window.print()}
                  style={{
                    backgroundColor: 'white',
                    border: '2px solid #2c5aa0',
                    color: '#2c5aa0',
                    padding: '15px 40px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Print
                </button>
              
      </div>
    </div>

    {/* Booking Image - Multiple Rooms Enhanced */}
    
       <div className="col-md-5 ">
              {selectedRooms.length > 0 ? (
                <div>
                  
                  
                  {/* Main Room Display */}
                  <div style={{ position: 'relative', marginBottom: '15px' }}>
                    <img 
                      src={selectedRooms[0].image || '/img/rooms/60.jpg'} 
                      alt={selectedRooms[0].name || selectedRooms[0].roomTypeName || 'Room'} 
                      style={{ 
                        width: '100%', 
                        // height: '220px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }} 
                    />
                    
                    {/* Overlay with main room info */}
                    <div style={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(43, 99, 121, 0.9), transparent)',
                      padding: '20px',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px'
                    }}>
                      <h5 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        {selectedRooms[0].name || selectedRooms[0].roomTypeName || 'Room'}
                      </h5>
                      <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '14px' }}>
                        {selectedRooms[0].quantity || 1} Room{(selectedRooms[0].quantity || 1) > 1 ? 's' : ''} | 
                        {selectedRooms[0].maxAdults || reservationData?.adults || 1} Adults, 
                        {selectedRooms[0].maxChildren || reservationData?.children || 0} Children
                      </p>
                      <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>
                        PKR {((selectedRooms[0].totalWithTaxNightly || selectedRooms[0].totalWithTax || selectedRooms[0].basePriceNightly || selectedRooms[0].price || 0) * (selectedRooms[0].quantity || 1) * (summary.nights || 1)).toLocaleString()} / {summary.nights} Nights
                      </p>
                    </div>
                  </div>

                  {/* Additional Rooms Grid */}
                  {selectedRooms.length > 1 && (
                    <div>
                      
                      <div style={{ 
                       
                        marginBottom: '15px'
                      }}>
                        {selectedRooms.slice(1).map((room, index) => (

                            <div key={index}  style={{ position: 'relative', marginBottom: '15px' }}>
                    <img 
                      src={room.image || '/img/rooms/60.jpg'} 
                      alt={room.name || room.roomTypeName || 'Room'} 
                      style={{ 
                        width: '100%', 
                        height: '250px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }} 
                    />
                    
                    {/* Overlay with main room info */}
                    <div style={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(43, 99, 121, 0.9), transparent)',
                      padding: '20px',
                      borderBottomLeftRadius: '8px',
                      borderBottomRightRadius: '8px'
                    }}>
                      <h5 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        {room.name || room.roomTypeName || 'Room'}
                      </h5>
                      <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '14px' }}>
                        {room.quantity || 1} Room{(room.quantity || 1) > 1 ? 's' : ''} | 
                        {room.maxAdults || reservationData?.adults || 1} Adults, 
                        {room.maxChildren || reservationData?.children || 0} Children
                      </p>
                      <p style={{ color: 'white', margin: '5px 0 0 0', fontSize: '14px', fontWeight: 'bold' }}>
                        PKR {((room.totalWithTaxNightly || room.totalWithTax || room.basePriceNightly || room.price || 0) * (room.quantity || 1) * (summary.nights || 1)).toLocaleString()} / {summary.nights} Nights
                      </p>
                    </div>
                  </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div>
                  <img src={summary.roomImage} alt={summary.roomName} style={{ width: '100%', borderRadius: '8px' }} />
                  <div style={{ 
                    backgroundColor: '#2B6379',
                    color: 'white',
                    padding: '20px',
                    marginTop: '-50px',
                    position: 'relative',
                    borderRadius: '8px',
                  }}>
                    <h3 style={{ color: 'white', margin: 0,fontSize: '50px' }}>{summary.roomName}</h3>
                    <p style={{ color: 'white', margin: '5px 0 0 0' }}>{summary.guests}</p>
                  </div>
                </div>
              )}
            </div>

    
  </div>
</div>
          </div>
        </div>
      </section>


 <div className="printable-section">
      
      {/* HEADER */}
      <div className="title-bar mb-3 d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bolder fs-5">Sintra Hotel</h6>

        <img
          src="/img/logos/brown logo.png"
          alt="Logo"
          style={{ height: '66px', width: '160px' }}
        />
      </div>

      {/* DETAILS */}
      <div className="row mb-2">
        <div className="col-md-6">
          <div className="fs-5">Check-in</div>
          <div className="fw-bold">{summary.checkIn}</div>

          <div className="fs-5">Check-out</div>
          <div className="fw-bold">{summary.checkOut}</div>

          <div className="fs-5">No. of Nights</div>
          <div className="fw-bold">{summary.nights}</div>

          <div className="fs-5">Booking Date</div>
          <div className="fw-bold">{summary.bookingDate}</div>

          {summary.arrivalTime && (
            <>
              <div className="fs-5">Arrival Time</div>
              <div className="fw-bold">{summary.arrivalTime}</div>
            </>
          )}
        </div>

        <div className="col-md-6">
          <div className="fs-5">Guest Name</div>
          <div className="fw-bold">{summary.guestName}</div>

          <div className="fs-5">Phone</div>
          <div className="fw-bold">{summary.phone}</div>

          <div className="fs-5">Guests</div>
          <div className="fw-bold">{summary.guests}</div>

          <div className="fs-5">Booking Ref</div>
          <div className="fw-bold">{bookingRef}</div>

          <div className="fs-5">Payment Method</div>
          <div className="fw-bold">{summary.paymentMethodLabel}</div>

          <div className="fs-5">Payment Status</div>
          <div className="fw-bold">{summary.paymentLabel}</div>
        </div>
      </div>

      <hr />

      {/* ROOM INFO */}
      <div className="mb-2">
        <div className="fw-bold fs-5">{summary.roomName}</div>
        <div className="d-flex gap-3">
          <span>{summary.checkIn}</span>
          <span>{summary.checkOut}</span>
          <span>☕ Breakfast</span>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-sm">
        <tbody>
          <tr>
            <td>
              <strong>Guest Name</strong><br />
              {summary.guestName}
            </td>
            <td>
              <strong>Booking Date</strong><br />
              {summary.bookingDate}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Occupancy</strong><br />
              {summary.guests}
            </td>
            <td>
              <strong>Subtotal</strong>
            </td>
            <td colSpan="2">
              PKR {Math.round(summary.subtotal)}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Meal</strong><br />
              Breakfast Included
            </td>
            <td>
              <strong>Taxes</strong>
            </td>
            <td colSpan="2">
              PKR {Math.round(summary.taxes)}
            </td>
          </tr>

          {summary.discount > 0 && (
            <tr>
              <td></td>
              <td>
                <strong>Voucher Discount</strong>
              </td>
              <td colSpan="2">
                PKR {Math.round(summary.discount)}
              </td>
            </tr>
          )}

          {summary.totalPaid > 0 && (
            <tr>
              <td></td>
              <td>
                <strong>Advance Paid</strong>
              </td>
              <td colSpan="2">
                PKR {Math.round(summary.totalPaid)}
              </td>
            </tr>
          )}

          <tr>
            <td colSpan="4" className="text-end fw-bold fs-5">
              Total: PKR {Math.round(summary.totalAmount)}
            </td>
          </tr>

          {summary.balance > 0 && (
            <tr>
              <td colSpan="4" className="text-end fw-bold">
                Balance Due at Hotel: PKR {Math.round(summary.balance)}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* IMPORTANT NOTES */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderLeft: '5px solid #2f6f88',
          padding: '15px',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#2B6379'
        }}
      >
        <h4>Important Notes</h4>
        <ul>
          <li>Party and loud gatherings are not allowed.</li>
          <li>Check-in time is 2PM. Early check-in subject to availability.</li>
          <li>Check-out time is 12 Noon. Late checkout charges may apply.</li>
          <li>Any damage to property will be charged.</li>
        </ul>

        <p>
          Contact support 24/7 at <strong>+(051) 8736313</strong>
        </p>

        <p>Thanks for choosing Sintra Hotel!</p>
      </div>
    </div>
 
    </>
  );
};

export default SintraThankYou;

  