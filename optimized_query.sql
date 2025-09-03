-- Optimized SQL Query
SELECT 
    tr.TRADING_ORDER_NO,
    tr.PAY_ST,
    tr.ORDER_ST,
    tr.ORDER_TYPE_MAP,
    tr.ORDER_TYPE,
    tr.SALE_CHANNEL,
    tr.ORDER_AMOUNT,
    tr.DISCOUNT_AMOUNT,
    tr.PAY_AMOUNT,
    tr.POINT_AMOUNT,
    tr.CURRENCY,
    tr.PAY_SUCCESS_DATE AS PAY_SUCCESS_DTM,
    tr.CREATE_DTM AS createDtm,
    tr.UPDATE_DTM,
    f.tkt_date,
    f.SETTLEMENT_TYPE,
    p.PC_CODE,
    p.SUB_PC_CODE,
    p.RETURN_AMT,
    p.CREATE_DTM AS PAY_CREATE_DTM,
    tr.one_channel,
    tr.two_channel,
    tr.three_channel,
    tr.four_channel AS channel
FROM ls_dc_trading tr
LEFT JOIN LS_DC_PAY p ON tr.TRADING_ORDER_NO = p.TRADING_ORDER_NO
LEFT JOIN (
    SELECT 
        TRADING_ORDER_NO, 
        TKT_DATE,
        SETTLEMENT_TYPE,
        ROW_NUMBER() OVER (PARTITION BY TRADING_ORDER_NO ORDER BY flight_order_no DESC) AS rn
    FROM ls_dc_flight 
) f ON tr.TRADING_ORDER_NO = f.TRADING_ORDER_NO AND f.rn = 1;