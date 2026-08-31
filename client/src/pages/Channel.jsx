import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Users, Video as VideoIcon, Mail } from "lucide-react";
import Avatar from "../components/Avatar";
import Spinner from "../components/Spinner";
import { VideoGrid } from "../components";
import { getUserChannel } from "../api/user";
import { getVideos } from "../api/video";
import { toggleSubscription } from "../api/subscription";
import useAuthStore from "../store/authStore";
import { formatCount, getErrorMessage } from "../utils/format";

const TABS = ["Videos", "Playlists", "Tweets", "About"];

function Channel() {
  const { username } = useParams();
  const currentUser = useAuthStore((s) => s.user);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [videoCount, setVideoCount] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [activeTab, setActiveTab] = useState("Videos");

  const isOwnChannel = currentUser && profile && profile._id === currentUser._id;

  useEffect(() => {
    let active = true;
    window.scrollTo(0, 0);
    const load = async () => {
      setLoading(true);
      setError("");
      setProfile(null);
      setVideoCount(null);
      setActiveTab("Videos");
      try {
        const res = await getUserChannel(username);
        if (active) setProfile(res.data);
      } catch (err) {
        if (active) setError(getErrorMessage(err, "This channel could not be found."));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [username]);

  // Fetch the channel's total video count for the header once we know the id.
  useEffect(() => {
    if (!profile?._id) return;
    let active = true;
    getVideos({ userId: profile._id, page: 1, limit: 1 })
      .then((res) => {
        if (active) setVideoCount(res.data?.totalDocs ?? 0);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [profile?._id]);

  const handleSubscribe = async () => {
    if (!profile?._id || subscribing) return;
    setSubscribing(true);
    const wasSubscribed = profile.isSubscribed;
    setProfile((p) => ({
      ...p,
      isSubscribed: !wasSubscribed,
      subscribersCount: Math.max(0, (p.subscribersCount || 0) + (wasSubscribed ? -1 : 1)),
    }));
    try {
      await toggleSubscription(profile._id);
      toast.success(wasSubscribed ? "Unsubscribed" : "Subscribed");
    } catch (err) {
      setProfile((p) => ({
        ...p,
        isSubscribed: wasSubscribed,
        subscribersCount: Math.max(0, (p.subscribersCount || 0) + (wasSubscribed ? 1 : -1)),
      }));
      toast.error(getErrorMessage(err, "Could not update subscription."));
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-md text-center px-4">
        <p className="font-title-md text-on-surface">{error || "Channel not found"}</p>
        <Link to="/" className="px-lg py-2.5 rounded-full bg-primary text-on-primary font-title-md hover:bg-primary/90 transition-colors">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="w-full h-32 sm:h-48 md:h-56 lg:h-64 bg-surface-container-low relative">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Channel banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-container-high via-surface-container to-primary/20" />
        )}
      </div>

      {/* Profile header */}
      <div className="px-4 md:px-lg max-w-7xl mx-auto -mt-10 md:-mt-14 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 pb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-background overflow-hidden bg-surface-container shrink-0">
            <Avatar src={profile.avatar} name={profile.fullName} size={128} className="w-full h-full rounded-full" />
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 md:mb-2 min-w-0">
            <div className="min-w-0">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-on-surface mb-1 truncate">
                {profile.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-meta-sm">
                <span className="font-medium text-on-surface">@{profile.username}</span>
                <span>•</span>
                <span>{formatCount(profile.subscribersCount || 0)} subscribers</span>
                {videoCount != null && (
                  <>
                    <span>•</span>
                    <span>{formatCount(videoCount)} videos</span>
                  </>
                )}
              </div>
            </div>
            {!isOwnChannel && (
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className={`px-6 py-2.5 rounded-full font-title-md transition-colors active:scale-95 disabled:opacity-60 ${
                    profile.isSubscribed
                      ? "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                      : "bg-primary text-on-primary hover:bg-primary-container"
                  }`}
                >
                  {profile.isSubscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-surface-variant mb-6 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-title-md whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? "text-primary font-bold border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "Videos" && (
          <VideoGrid
            userId={profile._id}
            emptyMessage={isOwnChannel ? "You haven't uploaded any videos yet." : "This channel has no videos yet."}
          />
        )}

        {activeTab === "About" && (
          <div className="px-4 md:px-lg pb-xl max-w-2xl flex flex-col gap-md">
            <div className="bg-surface-container rounded-xl p-lg flex flex-col gap-md">
              <div className="flex items-center gap-md">
                <Users className="size-5 text-primary shrink-0" aria-hidden="true" />
                <span className="font-body-md text-on-surface">
                  {formatCount(profile.subscribersCount || 0)} subscribers
                </span>
              </div>
              <div className="flex items-center gap-md">
                <VideoIcon className="size-5 text-primary shrink-0" aria-hidden="true" />
                <span className="font-body-md text-on-surface">
                  {videoCount != null ? formatCount(videoCount) : "—"} videos
                </span>
              </div>
              {profile.email && (
                <div className="flex items-center gap-md">
                  <Mail className="size-5 text-primary shrink-0" aria-hidden="true" />
                  <span className="font-body-md text-on-surface break-all">{profile.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {(activeTab === "Playlists" || activeTab === "Tweets") && (
          <div className="px-4 md:px-lg pb-xl">
            <p className="font-body-md text-on-surface-variant text-center py-xl">
              No {activeTab.toLowerCase()} yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Channel;
