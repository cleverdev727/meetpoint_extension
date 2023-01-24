import { DEFAULT_AVATAR, IMAGE_PROXY, THEMES } from "../../shared/constants";
import { FC, useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  orderBy,
  addDoc,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import CurrentLocationContext from "../../context/CurrentLocationContext";
import ClickAwayListener from "../ClickAwayListener";
import { ConversationInfo } from "../../shared/types";
import CreateConversation from "./CreateConversation";
import SelectConversation from "./SelectConversation";
import Spin from "react-cssfx-loading/src/Spin";
import UserInfo from "./UserInfo";
import { auth } from "../../shared/firebase";
import { db } from "../../shared/firebase";
import { signOut } from "firebase/auth";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import Alert from "../Alert";

const SideBar: FC = () => {
  const currentUser = useStore((state) => state.currentUser);

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [createConversationOpened, setCreateConversationOpened] =
    useState(false);
  const [isUserInfoOpened, setIsUserInfoOpened] = useState(false);

  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "array-contains", currentUser?.uid)
    )
  );
  const location = useLocation();
  const [isAlertOpened, setIsAlertOpened] = useState(false);
  const [alertText, setAlertText] = useState("");

  const { url } = useContext(CurrentLocationContext);
  const tmp = useCollectionQuery("all-users", collection(db, "users"));
  const cdata = tmp.data;
  const [isCreating, setIsCreating] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleToggle = (uid: string) => {
    if (selected.includes(uid)) {
      setSelected(selected.filter((item) => item !== uid));
    } else {
      const _selected = selected;
      _selected.push(uid);
      setSelected([..._selected]);
    }
  };
  useEffect(() => {
    if (cdata) {
      const handleCreateConversation = async () => {
        setIsCreating(true);
        const q = query(
          collection(db, "conversations"),
          where("currentTabURL", "==", url)
        );

        const querySnapshot = await getDocs(q);
        console.log("empty", querySnapshot.empty);

        await cdata?.docs
          .filter(
            (doc) =>
              doc.data().uid !== currentUser?.uid &&
              doc.data().currentTabURL != undefined &&
              doc.data().currentTabURL == url
          )
          .map((doc) => handleToggle(doc.data().uid));

        const sorted = await [...selected, currentUser?.uid].sort();
        console.log("sorted", sorted);

        if (querySnapshot.empty) {
          try {
            const create = async () => {
              try {
                const created = await addDoc(collection(db, "conversations"), {
                  users: sorted,
                  updatedAt: serverTimestamp(),
                  seen: {},
                  theme: THEMES[0],
                  currentTabURL: url ? url : "",
                });
                console.log("created", created.id);
                setIsCreating(false);
                navigate(`/${created.id}`);
              } catch (err) {
                alert(err);
              }
            };
            create();
          } catch (err) {
            alert(err);
          }
        } else {
          const taskDocRef = doc(db, "conversations", querySnapshot.docs[0].id);
          try {
            const updated = async () => {
              try {
                await updateDoc(taskDocRef, {
                  users: sorted,
                  updatedAt: serverTimestamp(),
                });
                console.log("updated--", querySnapshot.docs[0].id);
                setAlertText("😉 One has joined in " + url);
                setIsAlertOpened(true);
                navigate(`/${querySnapshot.docs[0].id}`);
                setIsCreating(false);
              } catch (err) {
                alert(err);
              }
            };
            updated();
          } catch (err) {
            alert(err);
          }
        }
      };
      handleCreateConversation().catch(console.error);
    }
  }, [cdata]);

  return (
    <>
      <div
        className={`h-screen flex-shrink-0 overflow-y-auto overflow-x-hidden border-r border-dark-lighten ${
          location.pathname !== "/"
            ? "hidden w-[350px] md:!block"
            : "w-full md:!w-[350px]"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-dark-lighten px-6">
          <Link to="/" className="flex items-center gap-1">
            <img className="h-8 w-8" src="/icon.png" alt="" />
            <h1 className="text-xl">MEETPOINT</h1>
          </Link>
          <div className="text-center text-primary">
            <b>{cdata?.docs.length}</b> Users
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCreateConversationOpened(true)}
              // onClick={handleCreateConversation}
              className="h-8 w-8 rounded-full bg-dark-lighten"
            >
              <i className="bx bxs-edit text-xl"></i>
            </button>

            <ClickAwayListener onClickAway={() => setIsDropdownOpened(false)}>
              {(ref) => (
                <div ref={ref} className="relative z-10">
                  <img
                    onClick={() => setIsDropdownOpened((prev) => !prev)}
                    className="h-8 w-8 cursor-pointer rounded-full object-cover"
                    src={
                      currentUser?.photoURL
                        ? IMAGE_PROXY(currentUser.photoURL)
                        : DEFAULT_AVATAR
                    }
                    alt=""
                  />

                  <div
                    className={`absolute top-full right-0 flex w-max origin-top-right flex-col items-stretch overflow-hidden rounded-md border border-dark-lighten bg-dark py-1 shadow-lg transition-all duration-200 ${
                      isDropdownOpened
                        ? "visible scale-100 opacity-100"
                        : "invisible scale-0 opacity-0"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setIsUserInfoOpened(true);
                        setIsDropdownOpened(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1 transition duration-300 hover:bg-dark-lighten"
                    >
                      <i className="bx bxs-user text-xl"></i>
                      <span className="whitespace-nowrap">Profile</span>
                    </button>
                    <button
                      onClick={() => signOut(auth)}
                      className="flex items-center gap-1 px-3 py-1 transition duration-300 hover:bg-dark-lighten"
                    >
                      <i className="bx bx-log-out text-xl"></i>
                      <span className="whitespace-nowrap">Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </ClickAwayListener>
          </div>
        </div>

        {loading ? (
          <div className="my-6 flex justify-center">
            <Spin />
          </div>
        ) : error ? (
          <div className="my-6 flex justify-center">
            <p className="text-center">Something went wrong</p>
          </div>
        ) : data?.empty ? (
          <div className="my-6 flex flex-col items-center justify-center">
            <p className="text-center">No conversation found</p>
            <button
              onClick={() => setCreateConversationOpened(true)}
              // onClick={handleCreateConversation}
              className="text-center text-primary"
            >
              Create one
            </button>
          </div>
        ) : (
          <div>
            {data?.docs.map((item) => (
              <SelectConversation
                key={item.id}
                conversation={item.data() as ConversationInfo}
                conversationId={item.id}
              />
            ))}
          </div>
        )}
      </div>

      {createConversationOpened && (
        <CreateConversation setIsOpened={setCreateConversationOpened} />
      )}

      <UserInfo isOpened={isUserInfoOpened} setIsOpened={setIsUserInfoOpened} />
      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={alertText}
      />
    </>
  );
};

export default SideBar;
