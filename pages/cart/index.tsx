import Head from "next/head";
import { getSession } from "next-auth/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import axios from "axios";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useState, useEffect } from "react";

import Items from "@/components/cart/Items";
import Summary from "@/components/cart/Summary";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const { req } = context;
    const session = await getSession({ req: req });

    if (!session) {
      return {
        props: {},
        redirect: {
          destination: "/",
        },
      };
    }

    const responseCart = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/cart_items/read`,
      { user_id: session?.user.id }
    );

    const responseSetting = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/v1/settings/read`
    );

    const cart_items = responseCart.data.data;
    const settings = responseSetting.data.data;

    return {
      props: {
        user: session.user,
        cart_items,
        settings,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "Error",
      },
    };
  }
};

export default function AccountPage({
  user,
  cart_items,
  settings,
}: {
  user: Record<string, any>;
  cart_items: Record<string, any>[];
  settings: Record<string, any>[];
}) {
  const [items, setItems] = useState<Record<string, any>[]>(cart_items);
  const [note, setNote] = useState<string>("No note");
  return (
    <>
      <Head>
        <title>Sweet Rounds | Checkout</title>
      </Head>
      <Row>
        <Col md={7} sm={12}>
          <Items
            cart_items={items}
            setItems={setItems}
            note={note}
            setNote={setNote}
          />
        </Col>
        <Col md={5} sm={12}>
          <Summary
            cart_items={items}
            settings={settings}
            note={note}
            user={user}
            setItems={setItems}
          />
        </Col>
      </Row>
    </>
  );
}