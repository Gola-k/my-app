import React, { useEffect, useState } from "react";
import {
  Abstraxion,
  useAbstraxionAccount,
  useAbstraxionSigningClient,
  useModal,
} from "@burnt-labs/abstraxion";
import { Button } from "@burnt-labs/ui";

const App = () => {
  const {
    data: { bech32Address } = {},
    isConnected,
    isConnecting,
  } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [executeResult, setExecuteResult] = useState(null);
  const [, setShow] = useModal();

  const claimSeat = async () => {
    if (!client || !bech32Address) return;
    setLoading(true);
    try {
      const msg = {
        sales: {
          claim_item: {
            token_id: String(new Date().getTime()),
            owner: bech32Address,
            token_uri: "",
            extension: {},
          },
        },
      };
      const result = await client.execute(
        bech32Address,
        "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka",
        msg,
        { gas: "500000", amount: [{ amount: "0.001", denom: "uxion" }] }
      );
      setExecuteResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log({ isConnected, isConnecting });
  }, [isConnected, isConnecting]);

  return (
    <main className="m-auto flex min-h-screen max-w-xs flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold tracking-tighter text-black dark:text-white">
        Abstraxion
      </h1>
      <Button
        fullWidth
        onClick={() => {
          setShow(true);
        }}
        structure="base"
      >
        {bech32Address ? (
          <div className="flex items-center justify-center">VIEW ACCOUNT</div>
        ) : (
          "CONNECT"
        )}
      </Button>
      {bech32Address && (
        <div className="border-2 border-primary rounded-md p-4 flex flex-row gap-4">
          <div className="flex flex-row gap-6">
            <div>address</div>
            <div>{bech32Address}</div>
          </div>
        </div>
      )}
      <Abstraxion onClose={() => setShow(false)} />
    </main>
  );
};

export default App;
