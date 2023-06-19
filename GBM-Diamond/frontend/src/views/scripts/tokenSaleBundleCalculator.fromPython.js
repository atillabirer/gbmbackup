//Comment : This should be massively simplified for same output. For now closing very close to python for debugging
function get_bundles( _minCoeff, _minExp, _maxCoeff, _maxExp){

    let curr_exponent = _minExp;   // start with the min specified by the user
    let coeffset = [1, 2, 5];

    if(coeffset.indexOf(_minCoeff) == -1 || coeffset.indexOf(_maxCoeff) == -1 ){
        throw "Invalid Coef value. Coef must be one of " + coeffset;
    }

    let how_many = coeffset.length;
    let count = 1; //count used to flag the completion of cycle
    let res_list = [];
    let istarted = false;

    let c;
    for(let i = 0; i<coeffset.length; i++){

        c = coeffset[i];

        if(!istarted){
            if(c != _minCoeff){
                count++;
            } else {
                istarted = true;
            }
        }

        if(count > how_many){
            curr_exponent++;
            if(curr_exponent > _maxExp){
                if(max_coeff == 1){
                    res_list = res_list.pop().pop();  
                } else if(max_coeff == 2){
                    res_list = res_list.pop();
                }
            }
            count = 1;
        }
        res_list.push(1.0 * c * (10 **curr_exponent ));
        count++;
    }
    return res_list;
}

function get_bundle_amounts(_total_tokens, bundle_sizes, _min_exp){
    let makeint = 1;
    if(min_exp < 0){
        Math.ceil(10 ** (-_min_exp));
    } 

    let _total_tokens = total_tokens * makeint;

    //     _bundle_sizes = [int(b * makeint) for b in bundle_sizes]
    for(let i = 0; i< bundle_sizes.lenght; i++){
        bundle_sizes[i] = Math.floor(bundle_sizes[i] * makeint);
    }

    //    bundle_amounts = defaultdict(int)
    let bundle_amounts = [];

    //     tokens_left = int(copy.copy(_total_tokens))
    let tokens_left = _total_tokens;

    //     for i, bundle_size in enumerate(reversed(_bundle_sizes)):
    for(let i = bundle_sizes.lenght -1; i >  0,lenght, i--){
        _bundle_size = Math.floor(bundle_sizes[i] * makeint);
        _tokens_left[i] = Math.floor(tokens_left * makeint);

        console.log("Now Making bundles of size " + _bundle_size);

        let max_num_bundle = Math.floor();

    }




}

/*
//OG Python by Lionel Blonde


import copy
import math
import os.path as osp
from itertools import cycle
import numpy as np
import matplotlib.pyplot as plt
from collections import defaultdict

from argparser_util import argparser
from helpers import get_color_gradient, autopct_func

from matplotlib import font_manager as fm


def get_bundles(*, min_coeff: int, min_exp: int, max_coeff: int, max_exp: int) -> list[float]:
    """Function that returns the different bundles for the client specifications."""
    curr_exponent = min_exp  # start with the min specified by the user
    coeffset = [1, 2, 5]  # hard-coded list of admissible coefficients
    assert min_coeff in coeffset, f"This in an invalid coeff: {min_coeff}"
    assert max_coeff in coeffset, f"This in an invalid coeff: {max_coeff}"
    # NOTE: the previous assertions are laid out in 2 lines for easier debugging
    how_many = len(coeffset)  # could very well hard-code this to int 3
    count = 1  # count used to flag the completion of cycle
    res_list = []
    istarted = False
    for c in cycle(coeffset):
        if not istarted:
            if c != min_coeff:
                count += 1
                continue
            else:
                istarted = True
        if count > how_many:
            curr_exponent += 1
            if curr_exponent > max_exp:
                print("We are almost done here.")
                # what we need to do now is remove the last unwanted items
                match max_coeff:
                    case 1:
                        del res_list[-2:]
                    case 2:
                        del res_list[-1:]
                    case _:
                        pass
                break
            count = 1
        res_list.append(float(c * (10**curr_exponent)))
        count += 1
    # print(f"{res_list = }")
    return res_list


def get_bundle_amounts(total_tokens: float, bundle_sizes: list[float],
                       min_exp: int) -> tuple[defaultdict[float, int], float]:
    """Function that iteratively asks the user for the desired number of each
    bundle size, while providing information to assist the user in its choices.
    Returns the list of amounts of bundles of each size to suggest to the client.
    """
    # constraint: the total and the bundles must have the same number of decimal places,
    # such that total_tokens * 10**(-min_exp) is always an int when min_exp < 0
    makeint = int(10**(-min_exp) if min_exp < 0 else 1)
    _total_tokens = float(total_tokens * makeint)
    assert _total_tokens.is_integer(), "at this stage, this must be an integer!"
    _bundle_sizes = [int(b * makeint) for b in bundle_sizes]

    bundle_amounts = defaultdict(int)
    tokens_left = int(copy.copy(_total_tokens))
    for i, bundle_size in enumerate(reversed(_bundle_sizes)):

        _tokens_left = tokens_left / makeint  # will be used several times for display purposes
        _bundle_size = bundle_size / makeint  # will be used several times for display purposes

        print(f"------------[[now making bundles of size {_bundle_size}]]")

        # calculate the max amount of bundles we can do with this size, and how many tokens would be left
        max_num_bundle, imagined_remainder = divmod(tokens_left, bundle_size)
        max_num_bundle = int(max_num_bundle)  # cast this into in quickly

        if max_num_bundle == 0:
            # if we can't even make a bundle with the amount of tokens that are left
            print(f"you don't have enough tokens left ({_tokens_left}) to make any bundle of size {_bundle_size}")
            print(">>>>>>>>>>>>>going straight to the next (and by design smaller) bundle size")
            continue

        if i > 0:
            # what need be said to the user: how many tokens remain to bundle up,
            # how many bundles of the current size we could do with the remainder,
            # and a summary of what has been chosen so far in the interaction (, and
            # finally statistics such as a "whale factor" computed from the choices)
            print(f"you have {_tokens_left} left, out of the {total_tokens} you started with,")
            print(f"i.e. you have used {100. * (1. - (tokens_left / _total_tokens)):.2f}% so far.")
        else:
            print(f"you start with {_tokens_left}.")

        if i > 0:
            print(f"with the remaining {_tokens_left} tokens,")
        print(f"you could do at most {max_num_bundle} bundle(s), each with {_bundle_size} token(s),")
        print(f"and if you do that you would end up with {imagined_remainder / makeint} tokens left.")
        print("(choosing '0' will skip this bundle size and go to the next one)")
        print(f"the bundle sizes that are left are: {list(reversed(bundle_sizes))[i:]}")

        if i > 0:
            print("-------------------------------[[ your bundles so far:")
            for k, v in bundle_amounts.items():
                print(f"{v} bundle(s) of size {k}")
            print("]]-------------------------------")

        if i == len(bundle_sizes) - 1:
            # if we are here, it means that 1. we are at the last bundle size, and
            # 2. we have not bundled all the tokens yet (otherwise we would have stopped already)
            # we now make as many bundles of this last size with the remaining bundles
            chosen_amount = max_num_bundle
            print("we have reached the last bundle size; you remainder will be forcibly bundled as best as possible")
            if imagined_remainder != 0:
                # give a heads up to the user when the number of tokens left is not divisible by the bundle size
                print("your last bundle size can not divide the number of token left...")
                print(f"-----> {imagined_remainder / makeint} token(s) will be left unbundled :(")
            else:
                print("congrats, your tokens have all been bundled!")
        else:
            print(f"so, how many bundles of the current size do you want? [0, {max_num_bundle}]")
            # loop this interaction over until an admissible value is given
            while True:
                try:
                    # finally prompt the interactor to make an actual decision!
                    chosen_amount = int(input(f"chose the number of bundles of size {_bundle_size}: "))
                    assert 0 <= chosen_amount <= max_num_bundle
                except ValueError:
                    print("invalid; you need give an integer value")
                    continue
                except AssertionError:
                    print(f"invalid; the value need be in [0, {max_num_bundle}]")
                    continue
                break  # if we reach this line it means we are through

        if chosen_amount > 0:  # if the chosen amount is not zero
            # update the running structures taking the choices into account
            bundle_amounts[bundle_sizes[-(1 + i)]] = chosen_amount
        tokens_left -= chosen_amount * bundle_size
        # if there are no token left, leave
        if tokens_left == 0:
            print("every token has been bundled, leaving, bye.")
            break
    # print(f"{bundle_amounts = }")
    return bundle_amounts, tokens_left / makeint


def set_bundle_amounts(total_tokens: float, bundle_sizes: list[float],
                       min_exp: int, whale_factor: float) -> tuple[defaultdict[float, int], float]:
    """Create the bundles without user input as opposed to the `get_bundle_amounts` function."""

    # constraint: the total and the bundles must have the same number of decimal places,
    # such that total_tokens * 10**(-min_exp) is always an int when min_exp < 0
    makeint = int(10**(-min_exp) if min_exp < 0 else 1)
    _total_tokens = float(total_tokens * makeint)
    assert _total_tokens.is_integer(), "at this stage, this must be an integer!"
    _bundle_sizes = [int(b * makeint) for b in bundle_sizes]

    assert 0. <= whale_factor <= 1., f"invalid value: {whale_factor}; it must be in the unit ball"

    bundle_amounts = defaultdict(int)
    tokens_left = int(copy.copy(_total_tokens))
    for i, bundle_size in enumerate(reversed(_bundle_sizes)):

        _tokens_left = tokens_left / makeint  # will be used several times for display purposes
        _bundle_size = bundle_size / makeint  # will be used several times for display purposes

        print(f"------------[[now making bundles of size {_bundle_size}]]")

        # calculate the max amount of bundles we can do with this size, and how many tokens would be left
        max_num_bundle, imagined_remainder = divmod(tokens_left, bundle_size)
        max_num_bundle = int(max_num_bundle)  # cast this into in quickly

        if max_num_bundle == 0:
            # if we can't even make a bundle with the amount of tokens that are left
            print(f"you don't have enough tokens left ({_tokens_left}) to make any bundle of size {_bundle_size}")
            print(">>>>>>>>>>>>>going straight to the next (and by design smaller) bundle size")
            continue

        if i == len(bundle_sizes) - 1:
            # if we are here, it means that 1. we are at the last bundle size, and
            # 2. we have not bundled all the tokens yet (otherwise we would have stopped already)
            # we now make as many bundles of this last size with the remaining bundles
            chosen_amount = max_num_bundle
            print("we have reached the last bundle size; you remainder will be forcibly bundled as best as possible")
            if imagined_remainder != 0:
                # give a heads up to the user when the number of tokens left is not divisible by the bundle size
                print("your last bundle size can not divide the number of token left...")
                print(f"-----> {imagined_remainder / makeint} token(s) will be left unbundled :(")
            else:
                print("congrats, your tokens have all been bundled!")
        else:
            chosen_amount = math.floor((whale_factor * tokens_left) / bundle_size)
            # NOTE: the following is highly inefficient code that yields the same result (given enough time),
            # and that can be used for sanity checks and the like
            #
            # chosen_amount = 0  # initialized at: we make no bundle of this size
            # for j in range(max_num_bundle, 0, -1):  # we have already treated the case max_num_bundle=0
            #     p = (j * bundle_size) / tokens_left
            #     print(j, p)
            #     if p <= whale_factor:
            #         # we take i bundles of this size
            #         chosen_amount = j
            #         print(f"choosing {j}")
            #         break
            #     else:
            #         print("next")
            #         continue

        print(f"chosen: {chosen_amount}")

        # update the running structures taking the choices into account
        bundle_amounts[bundle_sizes[-(1 + i)]] = chosen_amount
        tokens_left -= chosen_amount * bundle_size
        # if there are no token left, leave
        if tokens_left == 0:
            print("every token has been bundled, leaving, bye.")
            break
    # print(f"{bundle_amounts = }")
    return bundle_amounts, tokens_left / makeint


def showcase(bundles, tokens_left, font_path, num_tokens, fins_granularity, whale_factor, stack_pies=None):
    """Display via text and charts the fragmentation of the tokens obtained from the previous step."""
    # display the bundles that we have created and the tokens that are left
    # since we iterate over the dictionary anyway, populate another one without the keys with zero as value
    bundles_nonzero = defaultdict(int)  # technically a dict in enough since we only go over each key once but wth
    print("-------------------------------[[ your bundles")
    for k, v in bundles.items():
        print(f"{v} bundle(s) of size {k:,} | (tot={v * k:,}, perc={v * k * 100 / num_tokens:,.2f}%)")
        if v != 0:
            bundles_nonzero[k] = v
    print(f"tokens left: {tokens_left:,}]]-------------------------------")

    # create the data structures
    np_bundles_k = np.array(list(bundles_nonzero.keys()))
    np_bundles_v = np.array(list(bundles_nonzero.values()))
    np_bundles_tot = np_bundles_k * np_bundles_v
    np_bundles_perc = np_bundles_tot * 100 / num_tokens

    # create the font properties
    prop_suptitle = fm.FontProperties(fname=osp.join(font_path, "Roboto-MediumItalic.ttf"), size=16)
    prop_title = fm.FontProperties(fname=osp.join(font_path, "Roboto-Bold.ttf"), size=20)
    prop_texts = fm.FontProperties(fname=osp.join(font_path, "Roboto-Regular.ttf"), size=9)
    prop_autotexts = fm.FontProperties(fname=osp.join(font_path, "Roboto-Regular.ttf"), size=9)

    # control the absolute size of the outer pie; the size must be non-negative and below 1.0
    size_outer_ring = 0.2
    assert 0 < size_outer_ring < 1, "invalid size for the outer ring! Must be in (0, 1)"

    # define the colors as per the official GBM design sheet
    gbm_colors = {'primary': ['#49BEB7', '#085F63'], 'secondary': ['#FACF5A', '#FF5959']}
    color_gradient = get_color_gradient(gbm_colors['primary'][0], gbm_colors['secondary'][0], len(np_bundles_k))

    # create the data to display on the outer pie chart (the "per bundle" statistics)
    _np_bundles_v = np_bundles_v.copy()
    mask = (np_bundles_v / np_bundles_perc > fins_granularity)
    _np_bundles_v[mask] = np.floor(np_bundles_perc[mask] * fins_granularity)
    _np_bundles_v[_np_bundles_v == 0] = 1  # inoffensive hack to avoid dividing by zero
    np_bundles_perc_inflated = np.repeat(np_bundles_perc / _np_bundles_v, _np_bundles_v)
    color_gradient_inflated = np.repeat(color_gradient, _np_bundles_v)

    # create the labels for the figure
    labels = list(zip(np_bundles_k, np_bundles_v, np_bundles_tot, np_bundles_perc))
    _labels = []
    _labels_lighter = []
    for k, v, t, p in labels:
        _labels.append(f"{p:,.2f}% ({t:,.2f} tokens) are split in {v} bundles of {k:,.2f} tokens")
        _labels_lighter.append(f"{v} bundles of {k:,.2f} tokens\n= {t:,.2f} tokens")

    # create the figure
    if stack_pies is not None:
        _ = plt.subplot2grid((1, 3), (0, stack_pies))
    else:
        _, _ = plt.subplots()

    # create the inner pie chart
    wedges, texts, autotexts = plt.pie(np_bundles_tot, labels=_labels_lighter,
                                       autopct=autopct_func,
                                       colors=color_gradient,
                                       radius=1,
                                       wedgeprops=dict(width=1, edgecolor='w'))
    # NOTE: the variable `wedges` is unused when the legend plotting is commented out
    # create the outer pie chart
    plt.pie(np_bundles_perc_inflated,
            colors=color_gradient_inflated,
            radius=1,
            wedgeprops=dict(width=size_outer_ring, edgecolor='w'))
    plt.setp(texts, fontproperties=prop_texts)
    plt.setp(autotexts, fontproperties=prop_autotexts)
    suptitle = "Tokens per bundle size (inner pie), and per bundle (outer pie)"
    title = f"Selling {num_tokens} tokens with a whale factor of {whale_factor}"
    plt.suptitle(suptitle, fontproperties=prop_suptitle)
    plt.title(title, fontproperties=prop_title)
    # Uncomment the following line if you want to display the legend
    # plt.legend(wedges, _labels, loc="best", bbox_to_anchor=(1.1, 1.05))


if __name__ == '__main__':
    _args = argparser().parse_args()

    # create the list of bundles
    bundle_sizes = get_bundles(min_coeff=_args.min_coeff, min_exp=_args.min_exp,
                               max_coeff=_args.max_coeff, max_exp=_args.max_exp)

    if _args.sweep:
        # if we want to sweep over the range of whale factors
        for i, f in enumerate([0.1, 0.2, 0.3]):
            bundles, tokens_left = set_bundle_amounts(_args.num_tokens, bundle_sizes, _args.min_exp, whale_factor=f)
            showcase(bundles, tokens_left, _args.font_path, _args.num_tokens, _args.fins_granularity,
                     whale_factor=f, stack_pies=i)
    else:
        # actually create the bundles
        if _args.expert_mode:
            # interactive variant
            bundles, tokens_left = get_bundle_amounts(_args.num_tokens, bundle_sizes, _args.min_exp)
        else:
            # non-interactive variant, taking an additional hyper-parameter: the "whale factor"
            bundles, tokens_left = set_bundle_amounts(_args.num_tokens, bundle_sizes, _args.min_exp, _args.whale_factor)
        # showcase the results
        showcase(bundles, tokens_left, _args.font_path, _args.num_tokens, _args.fins_granularity, _args.whale_factor)

    # finally, show the charts
    plt.tight_layout()
    plt.show()
    # design choice: refrain from using `savefig` and force the use of the GUI
    # reason: far cleaner since the use of zooming and saving from there is far better, hence urged


*/